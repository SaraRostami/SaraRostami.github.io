---
layout: post
title: "Introduction to Neuroscience - Spring 2022"
---
Introduction to Neuroscience course presentd by [Dr. Mohammadreza Abolghasemi Dehaqani](https://ece.ut.ac.ir/en/~dehaqani) at the university of Tehran in the spring of 2022. these are the assignments and projects that I did throughout the course.


## Problem definition

<p align="justify"> 
<a href="https://scholar.google.com/citations?hl=en&user=N3hztTAAAAAJ&view_op=list_works&sortby=pubdate)" >Dr. Waldemar W. Koczkodaj</a> needed to access data provided by WHO in a desirable format. So, he asked me to find a way to extract the data available at <a href="https://covid19.who.int/table">https://covid19.who.int/table</a>. Since this data is updated consistently, he asked me to find a way to prove that WHO hosts the data we extracted.
</p>

## What we did

<p align="justify"> 
Since this page uses React for binding (i.e. it dynamically modifies DOM), it wasn't possible to copy and paste the table or do this by a static web crawler. So, the reasonable solution is to use browser simulation packages like selenium (an automated software testing package). However, even in this case, some trick is needed. So, to solve this problem, I used a different approach. I tracked this page's HTTP requests to find the data source.  
</p>

<p align="justify"> 
Interestingly, I found WHO has made the whole data in JSON format available at <a href="https://covid19.who.int/page-data/sq/d/3713876948.json"> LINK </a>. Therefore, we can use the latest version of this dataset whenever we want. The following code shows how we can do this in a line of code.
</p>

<img src="https://user-images.githubusercontent.com/30346122/209471977-cffc5c4f-a096-4c08-9ce6-4b1d4635479c.png" alt="code" class="w3-image">


<p align="justify">   
To prove that WHO hosts this data, I searched for a website named <a href="https://archive.org/web/" >wayback machine</a>, in which one can take screenshots from an arbitrary webpage and use it as a trusted citation. Therefore, I suggested using this website for the second part of the problem.
</p>

**Application Language(s):** N/A

**Programming Languages and Technologies:** Python, Matlab

**Member(s):** Sara Rostami, Mohammad Oladian, Keyhan Rayati

**[codes and more information ( N/A)](#)**
