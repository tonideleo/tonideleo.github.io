---
layout: post
title: Computational Implementation of the Jacobian Matrix for Implicit Non-Linear FEM Analyses
date: 2026-01-26
description: A detailed guide on implementing the Jacobian matrix in implicit finite element simulations with material non-linearities using sparse matrix techniques
tags: code math
categories: engineering
related_posts: false
---

I wrote this back in 2021 while working on gradient-based optimization techniques to calibrate non-linear material behaviors. It was a different time—before we could just ask an LLM to solve our problems for us.
The challenge was straightforward but tricky: explicit finite element algorithms work, but they require many iterations before convergence. For mild non-linearities, implicit solvers are much more efficient, often converging in just a few steps or even a single iteration. The real question was: given a material with a damage variable (starting simple with 1D, though this extends easily to multiple dimensions), how do you compute all the sensitivities in closed form?
This document was my solution to that problem. Once I figured it out, I was able to leverage MATLAB's excellent `fmincon` function to handle everything I needed.
These days, you could probably ask Claude or ChatGPT and get a more polished answer in seconds. But back then, we had to work through it the old-fashioned way. I learned a lot in the process, and hopefully you'll find this useful too. Enjoy!

## Introduction

The closed-form calculation of the Jacobian Matrix in an implicit scheme within the framework of the Finite Element Method (FEM) can be easily and efficiently implemented during the construction of the global stiffness matrix during the elemental sweep of the simulation domain. To further render the code efficient, particularly for larger scale problems, sparse matrix assembling is used. The format used is the *Compressed Sparse Column* (CSC) format, typical of MATLAB.

## Sparse Matrix Storage

To give the reader a better understanding of the storage of sparse matrices using the CSC format, consider the following example of a matrix with many zero entries as typical in global stiffness matrices:

$$
A = 
\begin{bmatrix}
10 & 20 & 0 & 0 & 0 & 0 \\
0 & 30 & 0 & 40 & 0 & 0 \\
0 & 0 & 50 & 60 & 70 & 0 \\
0 & 0 & 0 & 0 & 0 & 80 \\
\end{bmatrix}
$$

This matrix can be stored using the *triplets* arrays instead:

$$
\begin{gathered}
I = \begin{bmatrix}1&1&2&2&3&3&3&4\end{bmatrix}\\
J =  \begin{bmatrix} 1&2&2&4&3&4&5&6 \end{bmatrix}\\
W =  \begin{bmatrix} 10&20&30&40&50&60&70&80 \end{bmatrix}
\end{gathered}
$$

The arrays $I$ and $J$ are integer arrays which store the row and column, respectively, of the non-zero entries of the $A$ matrix. The size of such arrays is equal to the number of non-zero entries of the $A$ matrix. 

Computationally speaking, there are two ways to efficiently pre-allocate such arrays:

1. Calculate the number of non-zero entries and assign the proper size.
2. Pre-allocate the size of a given percentage size of the full matrix first and delete the unused elements after.

Depending on the density of the matrix and initial size, either method could be faster, not necessarily the first one.

The arrays $I,J,W$ can also be stored in different orders as long as the triplet coordination is respected. This allows an easy assemblage of the global stiffness matrix, for example, where same entries could also be called multiple times.

Another important step is to re-order the sparse matrix using the Cuthill–McKee algorithm. In this way the bandwidth of the matrix is minimized and operations such as inversion are greatly reduced. The figure below shows the difference between a non pre-conditioned (left) matrix and a matrix pre-conditioned using the Cuthill-McKee algorithm (right).

{% include figure.liquid loading="eager" path="assets/img/blog/jacobian-fem/matlab_plot.png" class="img-fluid rounded z-depth-1" zoomable=true caption="Graphical representation of non-zero elements in a matrix. Left matrix is not pre-conditioned while the matrix on the right is." %}
## Non-Linearities in FEM

Non-linearities in FEM are generally due to: (i) material non-linearities, (ii) large deformation, and (iii) non-linear contacts. In this document, only the first case is explored. Materials can have multiple behaviors, but a simple way to describe many of them is to use a damage variable $D$ which degrades the Young's modulus $E$. In the example of elastic-perfectly-plastic behavior, the damage variable $D$ can be derived in the following way.

Assuming classical Hooke's law with the addition of the damage factor $D$:

$$
\sigma = (1-D)E \varepsilon
$$

and knowing that after plastic initiation $\sigma$ must be equal to the strength $f_t$, we can set the above equation equal to $f_t$ and solve for $D$:

$$
D = 1 - \frac{f_t}{E \varepsilon}
$$

This shows the highly non-linear behavior of $D$, as $\varepsilon$ is present in the denominator. The advantage of using the *degrading* method is that while Hooke's law seems linear, the degrading factor $D$ (which is itself highly non-linear with respect to $\varepsilon$) can be iterated and the basic linear FEM computational implementation still used.

## Damage Variables in 1D Bar Elements

Assuming the reader knows how to derive the element stiffness matrix of the bar element in 1D, the addition of the damage variable via principle of virtual work is straightforward:

$$
\begin{Bmatrix}
f_1 \\
f_2
\end{Bmatrix}
=\frac{E(1-D)A}{L}
\begin{bmatrix}
1 & -1 \\ 
-1 & 1
\end{bmatrix}
\begin{Bmatrix}
u_1 \\
u_2
\end{Bmatrix}
$$

And the global system, assembled using standard techniques as outlined below:

```matlab
for i = 1 : Number_elements
    counter     =   counter + 1;
    % Find Nodal Coordinates of Node 1
    N1          =   N(N(:,1) == E(i,2),2:end);
    % Find Nodal Coordinates of Node 2
    N2          =   N(N(:,1) == E(i,3),2:end);
    % Find Length of the Element
    L(i)        =   N2(1)-N1(1);
    % Find Element Property ID
    propID      =   E(i,end);
    % Find Element Cross Sectional Area
    A(i)        =   P(P(:,1) == propID,3);
    % Find Element Material ID
    propMAT     =   P(P(:,1) == propID,2);
    % Find Young Modulus
    Emod(i)     =   M(M(:,1) == propMAT,2);
    % Find Strength
    ft(i)       =   M(M(:,1) == propMAT,3);

    K_local{i}  =   (A(i)*Emod(i)*(1-D(i))/L(i))*[1,-1;-1,1];
    
    E_conn{i}   =   [(E(i,2)*1),...
                     (E(i,3)*1)];       
    % Assembly in the Global Stiffness Matrix
    K_global(E_conn{i},E_conn{i}) = ...
                    K_global(E_conn{i},E_conn{i}) + K_local{i};
                    
    % If using sparse matrices, triplets are saved instead
    counterb = 0;
    for j = 1:2
        for k = 1:2
        counterb            =   counterb + 1;
            I(counterb)     =   j;
            J(counterb)     =   k;
            W(counterb)     =   Klocal{i}(j,k)
        end
    end
end
```

is generally written in matrix form as:

$$
\{F\} = [K]\{d\}
$$

which after applying boundary conditions is written in reduced form:

$$
\{F^{\text{red}}\} = [K^{\text{red}}]\{d^{\text{red}}\}
$$

Since now $D$ is non-linear, simple inversion of the $[K^{\text{red}}]$ cannot be done, and an iterative method must be used. The simplest to start with is the Newton-Raphson method. As a side note, multiple methods and hybrid or modified Newton methods are generally used, but are out of the scope of this document.

## Newton-Raphson Method

During the Newton-Raphson step, the non-linear equilibrium equations can be approximated as:

$$
\begin{gathered}
K^{\text{red}}(u_1 + \Delta u_1,\cdots,u_n + \Delta u_n)
\begin{Bmatrix}
u_1 + \Delta u_1 \\ \vdots \\ u_n + \Delta u_n
\end{Bmatrix} - \{d^{\text{red}}\} = \{O\} \\
\approx K^{\text{red}}(u_1,\cdots,u_n)
\begin{Bmatrix}
u_1 \\ \vdots \\ u_n
\end{Bmatrix}
- \{d^{\text{red}}\} + J(u_1,\cdots,u_n)
\begin{Bmatrix}
\Delta u_1 \\ \vdots \\ \Delta u_n
\end{Bmatrix}    
\end{gathered}    
$$

where $J(u_1,\cdots,u_n)$ is the Jacobian matrix.

A clear example of a 2 DOF system should clarify how to construct the Jacobian Matrix $J$:

$$
\begin{gathered}
K^{\text{red}}(u_1 + \Delta u_1,u_2 + \Delta u_2) 
\begin{Bmatrix}  u_1 + \Delta u_1 \\ u_2 + \Delta u_2 \end{Bmatrix}
- \begin{Bmatrix}  F_1 \\ F_2 \end{Bmatrix} = 
\begin{Bmatrix}  0 \\ 0 \end{Bmatrix} \\
\approx 
\begin{bmatrix} K_{11} & K_{12} \\ K_{21} & K_{22}\end{bmatrix}
\begin{Bmatrix}  u_1 \\ u_2 \end{Bmatrix} - 
\begin{Bmatrix}  F_1 \\ F_2 \end{Bmatrix} + \\
\begin{bmatrix}
\dfrac{\partial}{\partial u_1}(K_{11} u_1 + K_{12} u_2 - F_1) & \dfrac{\partial}{\partial u_2}(K_{11} u_1 + K_{12} u_2 - F_1) \\
\dfrac{\partial}{\partial u_1}(K_{21} u_1 + K_{22} u_2 - F_2) & \dfrac{\partial}{\partial u_2}(K_{21} u_1 + K_{22} u_2 - F_2)
\end{bmatrix}
\begin{Bmatrix}  \Delta u_1 \\ \Delta u_2 \end{Bmatrix}
\end{gathered}     
$$

where the reduced global stiffness matrix components $K_{11}$ to $K_{22}$ are assembled by sweeping over the elements in the domain and filling the corresponding DOF of each local elemental stiffness matrix into the global one. 

At this point, the new increments are found using:

$$
\begin{Bmatrix}
\Delta u_1 \\ \vdots \\ \Delta u_n
\end{Bmatrix}  =
-J(u_1,\cdots,u_n)^{-1} \left\{ K^{\text{red}}(u_1,\cdots,u_n)
\begin{Bmatrix}
u_1 \\ \vdots \\ u_n
\end{Bmatrix}
- \{d^{\text{red}}\} \right\}
$$

and the updated nodal displacements are found iteratively as:

$$
\begin{Bmatrix}
u_1 \\ \vdots \\ u_n
\end{Bmatrix}^{\text{new}} = 
\begin{Bmatrix}
u_1 \\ \vdots \\ u_n
\end{Bmatrix}^{\text{old}} + 
\begin{Bmatrix}
\Delta u_1 \\ \vdots \\ \Delta u_n
\end{Bmatrix}  
$$

by minimizing the following tolerance:

$$
\left\Vert [K^{\text{red}}] \{u_n\} - \{d^{\text{red}}\} \right\Vert < 10^{-6}
$$

## Assembly of the Jacobian Matrix

The tricky part is to systematically assemble the Jacobian matrix given any geometry and element connectivity matrix. This can be easily achieved with the introduction of a 3D matrix (similarly to a 3rd order tensor, even though it does not satisfy tensor properties) of the following form:

$$
\frac{\partial K}{\partial u}(i,j,k)
$$

where the derivatives of the global (or reduced) stiffness matrix with respect to each DOF $u$ are stored. The indices $i,j$ follow the DOF convention of the model, while the index $k$ refers to the differentiation index. The figure below is a visual representation of the 3D matrix.

{% include figure.liquid loading="eager" path="assets/img/blog/jacobian-fem/plot_jacobian.png" class="img-fluid rounded z-depth-1" zoomable=true caption="Visual representation of the 3D matrix which contains the derivatives of the global stiffness matrix with respect to each DOF." %}

Now, it is possible to add a simple if-condition to the assembly code in order to start assembling the 3D matrix, which must be pre-allocated properly outside of the elemental loop. If the condition of plasticity is satisfied, the damage variable is calculated (by either using elemental strain or nodal displacements) and the 3D matrix filled element by element:

```matlab
% e(i) = axial strain of element i
% This if-condition is satisfied at plastic phase
if e(i) > ft(i)/Emod(i)
    % Calculate Damage Variable of the element
    D(i)       =   1 - ft(i)/(Emod(i) * e(i));   
    % Calculate Derivative of the Damage Variable wrt nodal displacements
    dDdu(i,:)  =   [- ft(i)/Emod(i) * L(i) * 1 / (-e(i))^2,...
                    ft(i)/Emod(i) * L(i) * 1 / (-e(i))^2];
    % Fill the local dKdu and global one
    for j = 1 : size(dDdu,2)
        dK_local{i}(:,:,j)  =   [1,-1;-1,1].*-dDdu(i,j)*(A(i)*Emod(i)/L(i));
        dK_global(E_conn{i},E_conn{i},E_conn{i}(j))    =    dK_local{i}(:,:,j);
    end
end
```

where the derivative of the local elemental stiffness matrix is found using the following steps:

$$
\frac{\partial K}{\partial u} = \frac{\partial}{\partial u} 
\left(\frac{A E (1-D)}{L}
\begin{bmatrix}
1 & -1 \\ -1 & 1
\end{bmatrix}
\right )
= \frac{A E}{L}
\begin{bmatrix}
-\frac{\partial D}{\partial u} & \frac{\partial D}{\partial u} \\ 
\frac{\partial D}{\partial u} & -\frac{\partial D}{\partial u}
\end{bmatrix}    
$$

or simply:

$$
\frac{\partial K}{\partial u} = -\text{sign}(K) \cdot \frac{\partial D}{\partial u}
$$

please note the negative sign in front of the $\text{sign}$ operator.

Now, the full Jacobian matrix $J$ can be calculated as shown above by using the following code:

```matlab
% Pre-allocate the size of the Jacobian matrix
% This step is performed after reducing the global stiffness matrix
% rowes_to_keep = DOF not eliminated by BC
% u_old are the previous Newton step nodal displacements
% F_reduced are the reduced nodal forces from {F} = [K]{u}
% F_nh are the non-homogeneous nodal forces due to prescribed BC
J   =   zeros(length(rowes_to_keep));
counteri    =   0;
counterj    =   0;
for i = rowes_to_keep
    counteri    =   counteri + 1;
    for j = rowes_to_keep
        counterj    =   counterj + 1;
        J(counterj,counteri) = dot(dK_global(j,rowes_to_keep,i),u_old) - ...
                               F_reduced + ...
                               F_nh(j)*dK_global(j,j,i);
    end
    counterj    =   0;
end  
J   =   J + K_global_reduced;
```

where the double for-loop can be simplified into a vector operation instead, by properly multiplying the rows of the derivative of the stiffness matrix with respect to nodal coordinates with the previous Newton step nodal displacement. Due to laziness, the `dot` command was used instead to avoid problems with array orientation in MATLAB. The vectorization of the operation and sparse conversion is very straightforward and left to the reader.

Finally, a `while` loop can be used to iterate both the Newton step and the incremental load step. As a side note, even if not shown in this document, the choice of the load increment can be dynamic as it can be increased if the previous step converged easily, or properly reduced if not. This will allow for a faster run-time and fewer problems.

## Example Results

A final example is shown below where 3 1D bar elements undergo a prescribed displacement where the first element has a slightly lower plastic strength to induce localization and perform better debugging. On the left, a too large load increment step is shown, where the Newton-Raphson fails to properly minimize the tolerance, while on the right a smaller load increment is chosen to keep the tolerance below the wanted threshold at all times.

{% include figure.liquid loading="eager" path="assets/img/blog/jacobian-fem/plot_example.png" class="img-fluid rounded z-depth-1" zoomable=true caption="Example results of a three-element structure with one element with slightly lower strength to induce localization for debug purposes. Left: too large step purposely used to show convergence issues. Right: much smaller load increment step chosen." %}

## Conclusion

In this document, a quick description of the closed-form computational implementation of the Jacobian matrix for Non-Linear Finite Element Analyses is provided. Implicit simulations can be used to speed up analysis of small structures that experience mild non-linearities. If large or extreme non-linearities are expected, then an explicit code should be used instead. Explicit schemes are much easier to implement and conditionally stable. 

The calculation of the Jacobian matrix can be vectorized, which presents a very big advantage for computational performance. The choice of the load increment step is still a critical choice, but with this guide, you should not have any issue implementing an implicit non-linear simulation. Different damage variables can be used, even contact formulations can still be implemented using this approach. While the example is limited to 3 uni-dimensional bars, the code would work on any type of elements with multiple DOF per node.

---

## Complete Implementation Code

For those interested in the full implementation, here's the complete MATLAB code:

```matlab
clear all; close all; clc

Area            =   20;
Length          =   1;
Ef              =   3000;

fea_model       =   struct();

fea_model.P     =   [1, 1, Area;
                     2, 2, Area];
% [MatID, E]
fea_model.M     =   [1, Ef, 50;
                     2, Ef, 49];                 

fea_model.F     =   [];
                 
fea_model.N     =   [1, 0;
                     2, Length;
                     3, Length*2;
                     4, Length*3];                 
% [Element Number, N1, N2, P]
fea_model.E     =   [1 1 2 2;
                     2 2 3 1;
                     3 3 4 1]; 
                 
fea_model.BC    =   [1 1];
% [Node, X, Y]
fea_model.BC_NH =   [4 0.1*Length];                        

% Calculate total number of nodes
Number_nodes            =   size(fea_model.N,1);
% DOF per node
Node_element            =   2;
DOF_node                =   1;
% Calculate total number of Degrees of Freedom
DOF_total               =   Number_nodes*DOF_node;
% Calculate total number of Elements
Number_elements         =   size(fea_model.E,1);

% Presize Variables to save computational time
counter                 =   0;
F                       =   zeros(DOF_total,1);
F_nh                    =   zeros(DOF_total,1);

% Stiffness Matrix
K_local                 =   cell(Number_elements,1);

K_global                =   zeros(DOF_total);
dK_global               =   zeros(DOF_total,DOF_total,DOF_total);
dK_local                =   cell(Number_elements,1);
dDdu                    =   zeros(Number_elements,2);

% Elemental Quantity
RotMat                  =   cell(1,Number_elements);  
L                       =   zeros(Number_elements,1);
C                       =   zeros(Number_elements,1);
S                       =   zeros(Number_elements,1);
Emod                    =   zeros(Number_elements,1);
A                       =   zeros(Number_elements,1);
E_conn                  =   cell(Number_elements,1);
D                       =   zeros(Number_elements,1);
e                       =   zeros(Number_elements,1);
ft                      =   zeros(Number_elements,1);
u           =   0.1*Length;
du          =   u/100;
u_applied   =   0;
itermax     =   1000;

dt          =   0.0001;  % Time Step
t           =   0:dt:1;   % Time Domain
t_current   =   dt;
counterb     =   1;

u_old       =   [0;0];
while t_current < t(end)
    counterb            =   counterb + 1;
    t_current           =   t(counterb);
    u_applied           =   t_current * 0.1;
    
    fea_model.BC_NH     =   [4 u_applied]; 
    iter                =   0;
    toll                =   1;
    K_global            =   zeros(DOF_total);
    while toll > 1e-9 && iter < itermax
        iter        =   iter + 1;
        K_global    =   zeros(DOF_total);
        F           =   zeros(DOF_total,1);
        
        for i = 1 : Number_elements
            counter     =   counter + 1;
            N1          =   fea_model.N(fea_model.N(:,1) == fea_model.E(i,2),2:end);
            N2          =   fea_model.N(fea_model.N(:,1) == fea_model.E(i,3),2:end);

            L(i)        =   N2(1)-N1(1);

            propID      =   fea_model.E(i,end);
            A(i)        =   fea_model.P(fea_model.P(:,1) == propID,3);
            propMAT     =   fea_model.P(fea_model.P(:,1) == propID,2);
            Emod(i)     =   fea_model.M(fea_model.M(:,1) == propMAT,2);
            ft(i)       =   fea_model.M(fea_model.M(:,1) == propMAT,3);
            if e(i) > ft(i)/Emod(i)
                D(i)            =   1 - ft(i)/(Emod(i) * e(i));   
                dDdu(i,:)       =   [- ft(i)/Emod(i) * L(i) * 1 / (-e(i))^2,...
                                       ft(i)/Emod(i) * L(i) * 1 / (-e(i))^2];
                
                for j = 1 : size(dDdu,2)
                    dK_local{i}(:,:,j)  =   [1,-1;-1,1].*-dDdu(i,j)*(A(i)*Emod(i)/L(i));
                    dK_global(E_conn{i},E_conn{i},E_conn{i}(j))    =    dK_local{i}(:,:,j);
                end
            end

            K_local{i}  =   (A(i)*Emod(i)*(1-D(i))/L(i))*[1,-1;-1,1];
            
            E_conn{i}   =   [(fea_model.E(i,2)*1),...
                             (fea_model.E(i,3)*1)];       

            % Assembly in the Global Stiffness Matrix
            K_global(E_conn{i},E_conn{i}) = ...
                            K_global(E_conn{i},E_conn{i}) + K_local{i};
        end
        
        % Loop to populate F
        for i = 1:size(fea_model.F,1)
           F(fea_model.F(i,1)*1-0 : fea_model.F(i,1)*1) = fea_model.F(i,2:end);
        end

        % Loop to populate F using Inhomogeneous Boundary Conditions
        for i = 1:size(fea_model.BC_NH,1)
            F_nh(fea_model.BC_NH(i,1)*1-0 : fea_model.BC_NH(i,1)*1) = ...
                                                    fea_model.BC_NH(i,2:end);
        end
        
        for i = transpose(find(F_nh))
            F   =   F - K_global(:,i).*F_nh(i);
        end

        % Initialize Bookkeeping Matrix for Rows and Columns Elimination
        BC_to_eliminate         =   zeros(DOF_total,1);
        counter                 =   0;
        for i = transpose(fea_model.BC(:,1))
            counter                     =   counter + 1;
            BC_to_eliminate(i*1-0:i*1)  =   fea_model.BC(counter,2:end);
        end

        % Correct for inhomogeneous BC
        BC_to_eliminate         =   BC_to_eliminate + F_nh;
        % Determine Index of Rows and Column to keep or eliminate
        rowes_to_eliminate      =   find(BC_to_eliminate)';
        rowes_to_keep           =   find(~BC_to_eliminate)';
        
        J   =   zeros(length(rowes_to_keep));
        counteri    =   0;
        counterj    =   0;
        for i = rowes_to_keep
            counteri    =   counteri + 1;
            for j = rowes_to_keep
                counterj    =   counterj + 1;
                J(counterj,counteri) = dot(dK_global(j,rowes_to_keep,i),u_old) - 0 + ...
                                           F_nh(j)*dK_global(j,j,i);
            end
            counterj    =   0;
        end  
        
        % Reduce the Stiffness, Mass, and Force Matrix
        K_global_reduced                            =   K_global;
        dK_global_reduced                           =   dK_global;
        K_global_reduced(rowes_to_eliminate, :)     =   [];
        K_global_reduced(:,rowes_to_eliminate)      =   [];
        dK_global_reduced(:,rowes_to_eliminate,:)   =   [];
        dK_global_reduced(rowes_to_eliminate,:,:)   =   [];
        
        F_reduced                                   =   F;
        F_reduced(rowes_to_eliminate)               =   [];
        
        J       =   K_global_reduced + J;
        
        du_new  =   -inv(J)*(K_global_reduced*u_old - F_reduced);  
        u_new   =   u_old + du_new;

        Displacement(rowes_to_eliminate)        =   0;
        Displacement(find(F_nh))                =   u_applied;
        Displacement(rowes_to_keep)             =   u_new;    
        u           =   fea_model.N;
        counter     =   0;
        for i = 1:1:length(Displacement)
            counter     =   counter + 1;
            u(counter,2:end)  =   Displacement(i:i);
        end 
        K_global    =   zeros(DOF_total);
        for i = 1 : Number_elements
            u_node1     =   u(u(:,1) == fea_model.E(i,2),2:end);
            u_node2     =   u(u(:,1) == fea_model.E(i,3),2:end); 

            e(i)        =   (u_node2 - u_node1)/L(i);
            s(i)        =   (1-D(i))*e(i)*Emod(i);

            if e(i) > ft(i)/Emod(i)
                D(i)            =   1 - ft(i)/(Emod(i) * e(i)); 
            end
            
            K_local{i}  =   (A(i)*Emod(i)*(1-D(i))/L(i))*[1,-1;-1,1];   

            % Assembly in Global Stiffness Matrix
            K_global(E_conn{i},E_conn{i}) = ...
                            K_global(E_conn{i},E_conn{i}) + K_local{i};            
        end   
        K_global_reduced                            =   K_global;
        K_global_reduced(rowes_to_eliminate, :)     =   [];
        K_global_reduced(:,rowes_to_eliminate)      =   [];
        iter;
        toll    =   norm(K_global_reduced*u_new - F_reduced);
    end
    
    u_old                                   =   u_new;
    
    EE(counterb,:)    =   e';
    SS(counterb,:)    =   s;   
end
    
figure
scatter(EE(:,1),SS(:,1)); hold on
scatter(EE(:,2),SS(:,2))
scatter(EE(:,3),SS(:,3))
```