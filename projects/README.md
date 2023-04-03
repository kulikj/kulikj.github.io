# DS4200 Final Project

Link to GitHub Pages: [`https://ds4200-s23-class.github.io/project-finance-viz/`](https://ds4200-s23-class.github.io/project-finance-viz/)

Clone this repo and work locally. Be sure to push the final version of your code (and any significant updates along the way) before submitting. To work locally, you will need to set up a Python Simple Server. Instructions for this are included below.  

In order for all group members to work on code in tandem, we recommend using Branches. [Here](https://thenewstack.io/dont-mess-with-the-master-working-with-branches-in-git-and-github/) is an overview of Branches and how they help organize collaborative coding.   

## Purpose

The purpose of this assignment is to practice the entire pipeline of developing a novel visualization.   

## Instructions

1. Resources to support this assignment are provided in the Resources section below.  

1. Create a GitHub Page for your repo and add the link to your GitHub Page above where you see `[https://ds4200-s23-class.github.io/project-finance-viz/](https://ds4200-s23-class.github.io/project-finance-viz/)` (if you put the link inside of the `[]` and the `()` you will get a clickable hyperlink). 

1. The index.html file included in this repo outlines the major sections required for the website hosting your final project visualization tool. You may add additional styling, but do not delete any sections as we will check and grade all of them after your final submission at the end of the semester. You will not fill in all sections right away, each of the following project milestones will specify which sections you are expected to work on. 

1. All styling should be done via an *external* stylesheet (no styling should be done inline). 

1. All js should be included via an *external* javascript file (no javascript code should be included in your html file).   

1. Please see the project overview and pm assignments for specific assignment requirements. 

## Python Simple Server

- In order to read data from csv files, you will need to use a python simple server. To do that, follow these steps:
  - `CD` or open a terminal / command prompt window in the same folder that holds your website code.
  - Start a python simple server with one of these commands (depending on how you set python up on your machine): `python -m http.server`, `python3 -m http.server`, or `py -m http.server`. 
  - After running the command, wait for the output: `Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/)`.
  - Open your web browser (Firefox or Chrome) and navigate to the URL: http://localhost:8000. This is where you will see your code rendered. 

## Resources 

* [HTML Page on w3schools](https://www.w3schools.com/html/default.asp). (On the left-hand side of the page there is a menu bar with links to various topics.) 

* [CSS Page on w3schools](https://www.w3schools.com/css/default.asp). (On the left-hand side of the page there is a menu bar with links to various topics.) 

**Note that there are different versions of D3 (we are using version 6), so make sure the tutorials you use are up-to-date (or you at least understand what is different about v6 versus older versions).**

* [Intro to D3 - Creative Coding for the Web](https://www.fluidencodings.com/teaching-materials/cc-for-the-web/v1/page.php?pid=svg)

* [D3 Data Joins - Creative Coding for the Web](https://www.fluidencodings.com/teaching-materials/cc-for-the-web/v1/page.php?pid=data-joins) 

* Intro to D3 in 10 basic examples: https://www.d3-graph-gallery.com/intro_d3js.html (highly recommend this resource)

* D3 Coursera by Enrico Bertini: https://www.coursera.org/learn/information-visualization-programming-d3js

* What is D3? https://d3js.org/

* Example D3 Charts: https://observablehq.com/@d3/gallery

* Interactive Data Visualization for the Web by Scott Murray: Available through Northeastern Library

* Tips and Tricks: https://leanpub.com/D3-Tips-and-Tricks/read (written for v3 but well written)

* Brushing: https://d3-graph-gallery.com/graph/interactivity_brush.html#realgraph 

## Submission

* Be sure to push all changes to your repo and follow all instructions above. 
* Submit your assignment on Gradescope  
