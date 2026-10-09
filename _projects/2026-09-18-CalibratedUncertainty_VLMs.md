---
layout: post
title: "Calibrated Uncertainty in Vision-Language Models"
---
Graduate course project (CS 9840, Western University). Vision-language models are often overconfident: they assign high confidence to wrong answers. We evaluated whether post-hoc calibration can fix this for a frozen [BLIP-2](https://arxiv.org/abs/2301.12597) model on visual question answering (VQA v2), comparing **temperature scaling**, **MC Dropout** and a **lightweight Laplace approximation**, and tested confidence-based abstention.

Temperature scaling cut the expected calibration error (ECE) from 0.321 to 0.097 at almost no inference cost; MC Dropout reached the highest accuracy (0.815); the lightweight Laplace approximation gave only limited benefit.

**Programming Languages and Technologies:** Python, PyTorch, Hugging Face, BLIP-2

**Member(s):** Tingnan Bi, Sara Rostami, Nouran Sakr

**[codes and report (Available)](https://github.com/ting3bi/cs9840)**
