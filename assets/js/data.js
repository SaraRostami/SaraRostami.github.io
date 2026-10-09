/*
 * Site content. Edit this file to add or update projects, experience,
 * education and recognition — the page renders from it.
 *
 * tracks: "academia", "industry" or both. They drive the lens switch
 * (All / Academia / Industry) and the project filters.
 * doneLabel: heading over the bullet list (defaults to "What I did").
 * sections: optional extra blocks in the project dialog, shown after the
 *      summary: { heading, text?, items?, callout? } (callout = highlighted box).
 * viz: optional key of an interactive figure in viz.js
 *      ("calibration", "erp", "montage", "pipeline").
 */
window.SITE = {
  projects: [
    {
      id: "eeg-fnirs",
      featured: true,
      title: "Visual perception and image memorability with simultaneous EEG–fNIRS",
      context: "MSc thesis · Mohsenzadeh Lab, Western University & Vector Institute",
      period: "2025 – present",
      tracks: ["academia", "industry"],
      image: "assets/img/projects/eeg-fnirs.svg",
      alt: "Head schematic with EEG electrodes and fNIRS optodes beside a fast EEG trace and slow hemodynamic curves",
      summary:
        "My MSc thesis asks how the brain turns an image into something we perceive, and why some images stay in memory while others are forgotten. I record EEG and fNIRS at the same time: EEG tracks electrical activity millisecond by millisecond, fNIRS tracks the slower blood-oxygen response, so together they show both when and how strongly the brain responds to each image.",
      sections: [
        {
          heading: "Research questions",
          items: [
            "Can an image's category, and how memorable it is, be decoded from brain activity, and how early does that information appear?",
            "How do the fast electrical (EEG) and slower hemodynamic (fNIRS) responses to the same image relate to each other?",
            "Do neuro-inspired deep networks capture the same signatures of perception and memorability that we measure in the brain?"
          ]
        },
        {
          heading: "Why memorability?",
          text:
            "Memorability turns out to be a consistent property of an image: people tend to remember, and forget, the same pictures (Isola et al., 2011). That makes it measurable and predictable, and its neural basis shows what the visual system prioritises."
        },
        {
          heading: "From the lab to industry: advertising and marketing",
          callout: true,
          text:
            "An ad, a product photo or a thumbnail only works if people remember it later. Because memorability can be measured and predicted, this research translates into tools for creative and marketing teams. EEG and fNIRS are also core tools of consumer neuroscience (neuromarketing).",
          items: [
            "Pre-testing ads, product imagery, thumbnails and logos for memorability before a campaign launches.",
            "Choosing between design variants with a model's prediction, alongside A/B tests and recall surveys.",
            "Building memorability predictors grounded in brain data and interpretable enough to show why an image sticks."
          ]
        }
      ],
      bullets: [
        "Designed and run the simultaneous acquisition protocol: 32-channel EEG co-registered with 32 fNIRS optodes, 20+ participants, 5 image categories.",
        "Built the study's end-to-end preprocessing, artifact-rejection and feature-extraction pipeline, replacing a manual workflow with one reproducible run per subject.",
        "Multivariate decoding over 936 trials per participant with permutation-based significance testing, linking neural signals to behavioural measures of category perception and memorability.",
        "Designing and benchmarking neuro-inspired deep network architectures in PyTorch against the experimental findings."
      ],
      tags: ["EEG", "fNIRS", "Image memorability", "Multivariate decoding", "Permutation testing", "PyTorch", "MATLAB"],
      people: "Supervised by Dr. Yalda Mohsenzadeh and Dr. Emma Duerden",
      links: [
        { label: "Mohsenzadeh Lab", url: "https://mohsenzadehlab.ca/" },
        { label: "Isola et al. (2011), CVPR", url: "https://doi.org/10.1109/CVPR.2011.5995721" }
      ],
      viz: "montage"
    },
    {
      id: "vlm-calibration",
      featured: true,
      doneLabel: "What we did",
      title: "Calibrated uncertainty in vision-language models",
      context: "Graduate course project · CS 9840, Western University",
      period: "2026",
      tracks: ["industry", "academia"],
      image: "assets/img/projects/vlm-calibration.svg",
      alt: "An image with a question and two answer chips, next to a reliability diagram comparing an overconfident model with a calibrated one",
      summary:
        "A vision-language model that is confidently wrong is worse than one that says “I'm not sure.” We measured how overconfident a frozen BLIP-2 is on visual question answering and compared three post-hoc fixes, temperature scaling, MC Dropout and a lightweight Laplace-style approximation, without retraining the backbone. We also tested confidence-based abstention.",
      bullets: [
        "Scored candidate answers with BLIP-2 and normalised them into confidences on a balanced VQA v2 subset (yes/no, number and open-ended questions).",
        "Evaluated accuracy, expected calibration error (ECE), negative log-likelihood (NLL) and reliability diagrams for every method.",
        "Temperature scaling cut ECE from 0.321 to 0.097 at almost no inference cost. MC Dropout reached the highest accuracy (0.815). The lightweight Laplace approximation helped only slightly."
      ],
      tags: ["BLIP-2", "VQA", "Calibration", "Uncertainty", "MC Dropout", "Laplace", "PyTorch"],
      people: "With Tingnan Bi and Nouran Sakr",
      links: [
        { label: "Code & report", url: "https://github.com/ting3bi/cs9840" },
        { label: "Report (PDF)", url: "https://github.com/ting3bi/cs9840/blob/main/CS9840_Final_Report-3.pdf" }
      ],
      viz: "calibration"
    },
    {
      id: "neurosentry",
      featured: true,
      doneLabel: "What we built",
      title: "NeuroSentry: real-time stroke-risk triage",
      context: "Hackathon project · Hack Western 12",
      period: "2025",
      tracks: ["industry"],
      image: "assets/img/projects/neurosentry.svg",
      alt: "A phone tracking a facial mesh and heart rate, streaming to FastAPI and Gemini, ending in a triage dashboard with a risk gauge",
      summary:
        "In a stroke, every minute counts. NeuroSentry turns a phone into a triage sensor: it watches for facial asymmetry, speech changes and vital-sign shifts in real time, then flags high-risk patients so clinicians can act sooner.",
      bullets: [
        "A SwiftUI iOS client captures facial-mesh landmarks and vitals (Presage SmartSpectra SDK) and streams them to a FastAPI backend.",
        "A Gemini pipeline grounded in clinical guidelines returns strictly structured JSON risk scores.",
        "A React + TypeScript dashboard surfaces the scores for triage."
      ],
      tags: ["LLM pipeline", "Gemini", "FastAPI", "SwiftUI", "React", "Multimodal"],
      people: "Team project, Hack Western 12",
      links: [{ label: "Devpost", url: "https://devpost.com/software/neutro-sentry" }],
      viz: "pipeline"
    },
    {
      id: "vmmn",
      featured: true,
      title: "Repetition vs. expectation in the visual mismatch negativity",
      context: "MSc thesis · University of Tehran",
      period: "2022 – 2024",
      tracks: ["academia"],
      image: "assets/img/projects/vmmn.svg",
      alt: "A rapid stream of images with one deviant highlighted, beside ERP waveforms showing the mismatch negativity window",
      summary:
        "Is the brain's automatic change-detection signal driven by plain repetition, or by violated predictions? I designed a Rapid Serial Visual Presentation (RSVP) paradigm, inspired by Summerfield et al. (2008), to pull the two apart within the predictive-coding framework, using complex visual stimuli instead of simple ones.",
      bullets: [
        "Acquired and preprocessed 128-channel EEG from 15 participants (EEGLAB, FieldTrip).",
        "Combined ERP analysis with multivariate pattern analysis and permutation testing to isolate the spatiotemporal signatures of repetition and expectation.",
        "Built reusable univariate and multivariate workflows that informed downstream computational models."
      ],
      tags: ["EEG", "ERP", "MVPA", "Predictive coding", "EEGLAB", "FieldTrip", "MATLAB"],
      people: "Supervised by Dr. Mohammadreza Abolghasemi Dehaqani",
      links: [
        { label: "Code", url: "https://github.com/SaraRostami/Master_Thesis" },
        { label: "Summerfield et al. (2008)", url: "https://www.nature.com/articles/nn.2163" }
      ],
      viz: "erp"
    },
    {
      id: "xai",
      title: "Explaining deep models: SHAP, LIME & D-RISE",
      context: "Trustworthy AI · University of Tehran",
      period: "2023",
      tracks: ["industry", "academia"],
      image: "assets/img/projects/xai.svg",
      alt: "An image split into superpixels with a saliency overlay, beside a SHAP feature-attribution bar chart led by schooling",
      summary:
        "Opening up black-box models for tabular, image and detection tasks, and stress-testing how robust they are.",
      bullets: [
        "SHAP (Deep and Kernel) on a WHO life-expectancy network: schooling came out as the dominant predictor.",
        "LIME superpixel saliency to explain MobileNetV2 image classifications.",
        "D-RISE for model-agnostic explanations of object detectors.",
        "Probed robustness with adversarial examples from the Fast Gradient Method."
      ],
      tags: ["Explainable AI", "SHAP", "LIME", "D-RISE", "Adversarial robustness", "PyTorch"],
      links: [
        {
          label: "Code",
          url: "https://github.com/SaraRostami/University/tree/main/Trustworthy%20AI%20-%20Spring%202023/HW2_Model%20Interpretability"
        }
      ]
    },
    {
      id: "sleep",
      title: "Predicting memory consolidation from sleep physiology",
      context: "Research internship · Genzel Lab, Donders Institute (Radboud University)",
      period: "2022 – 2023",
      tracks: ["academia"],
      image: "assets/img/projects/sleep.svg",
      alt: "A sleep hypnogram above a ranked feature-importance bar chart",
      summary:
        "Part of the Systems Consolidation During Sleep project: which physiological events during sleep predict whether a memory is consolidated?",
      bullets: [
        "Compared four classifiers (logistic regression, decision tree, random forest, naive Bayes) on physiological sleep recordings.",
        "Used random-forest feature importance to isolate the top predictors of memory consolidation.",
        "Prepared, wrangled and visualised event-characteristics data for the lab's analysis pipeline."
      ],
      tags: ["Sleep", "Memory", "Random forest", "Python", "MATLAB"],
      links: [
        { label: "Code (event characteristics)", url: "https://github.com/genzellab/HM_RAT" },
        { label: "Genzel Lab", url: "https://www.genzellab.com/" }
      ]
    },
    {
      id: "eeg-emotion",
      title: "EEG emotion recognition with deep reinforcement learning",
      context: "BSc project · Babol Noshirvani University of Technology",
      period: "2021",
      tracks: ["academia", "industry"],
      image: "assets/img/projects/eeg-emotion.svg",
      alt: "Multi-channel EEG traces feeding a reinforcement-learning agent loop and a valence-arousal emotion map",
      summary:
        "Predicting emotional states from EEG on the DEAP dataset by framing recognition as a deep reinforcement learning problem. This is where my interest in how the brain encodes affect and cognition began.",
      bullets: [
        "Applied deep RL agents (Stable-Baselines) to EEG features from the DEAP dataset.",
        "Mapped predictions to the valence–arousal model of emotion."
      ],
      tags: ["EEG", "Deep RL", "Stable-Baselines", "Python"],
      people: "With Taha Rostami · supervised by Dr. Hesam Omranpour",
      links: [{ label: "Code", url: "https://github.com/SaraRostami/DeepRL_EmotionRecognition_UsingEEGsignals" }]
    },
    {
      id: "rsa",
      doneLabel: "What we did",
      title: "Emotion, reward and punishment in fMRI",
      context: "Neuromatch Academy · Computational Neuroscience",
      period: "2022",
      tracks: ["academia"],
      image: "assets/img/projects/rsa.svg",
      alt: "A brain outline with highlighted regions beside a representational dissimilarity matrix split into win and loss trials",
      summary:
        "Using the Human Connectome Project gambling task, we asked whether brain areas that respond to emotion cues also respond more strongly to reward and punishment feedback.",
      bullets: [
        "Built individual-level representational dissimilarity matrices and ran RSA to compare activation patterns in win vs. loss trials.",
        "Used a random-forest classifier for the group-level analysis."
      ],
      tags: ["fMRI", "RSA", "HCP", "Python"],
      people: "With Srijita Karmakar, Sunghyun Park and Muskan Mittal",
      links: [
        { label: "Code", url: "https://github.com/SaraRostami/IndependentCodingVentures/tree/main/NeuromatchAcademy_Summer2022" },
        {
          label: "Certificate",
          url: "https://github.com/SaraRostami/IndependentCodingVentures/blob/c1bc8809b3490ccfb022f2c099091c930b961583/NeuromatchAcademy_Summer2022/NMA_Student_summer2022.pdf"
        }
      ]
    },
    {
      id: "generative",
      title: "Deep learning from the papers: GANs and transformers",
      context: "Neural Networks & Deep Learning · University of Tehran",
      period: "2022 – 2023",
      tracks: ["industry"],
      image: "assets/img/projects/generative.svg",
      alt: "A self-attention matrix over a short sentence beside a grid of generated samples",
      summary:
        "Re-implementing landmark architectures from their papers to understand them from the inside, and applying deep networks to practical problems.",
      bullets: [
        "DCGAN, AC-GAN and WGAN-GP with stabilisation techniques.",
        "BERT and BEiT attention implementations.",
        "Fraud detection, OCR and audio classification with deep networks."
      ],
      tags: ["GANs", "Transformers", "BERT", "BEiT", "PyTorch", "Keras"],
      links: [{ label: "Code", url: "https://github.com/SaraRostami/University" }]
    },
    {
      id: "data-science",
      title: "Data science for real-world decisions",
      context: "Data Analysis · University of Tehran",
      period: "2022",
      tracks: ["industry"],
      image: "assets/img/projects/data-science.svg",
      alt: "A cohort-retention heatmap, a price series with a forecast band, and a database icon",
      summary:
        "End-to-end analyses on messy real-world data, from scraping and SQL to forecasting and decision-ready visualisation.",
      bullets: [
        "Cryptocurrency forecasting: scraped price history with Selenium, engineered features, reduced dimensionality and modelled Bitcoin trends.",
        "Customer retention: cohort-based retention-rate analysis and visualisation.",
        "Healthcare process mining of patient treatment pathways.",
        "Designed a PostgreSQL database of national birth statistics (2012–2021), queried with Psycopg2 and mapped with PostGIS/QGIS.",
        "Hate-crime EDA: trends in bias motivation, victim demographics and geography."
      ],
      tags: ["Python", "SQL", "PostgreSQL", "Selenium", "Time series", "Visualisation"],
      links: [{ label: "Code", url: "https://github.com/SaraRostami/University/tree/main/Data%20Analysis%20-%20Fall%202022" }]
    }
  ],

  courses: [
    { title: "Trustworthy AI", term: "Spring 2023", url: "https://github.com/SaraRostami/University/tree/main/Trustworthy%20AI%20-%20Spring%202023" },
    { title: "Bio-inspired Computing", term: "Spring 2023", url: "https://github.com/SaraRostami/University/tree/63b8ca39f91fefc349b1b93c570c8de36243c48c/Bio-inspired%20Computing%20-%20Spring%202023" },
    { title: "Neural Networks & Deep Learning", term: "Fall 2022", url: "https://github.com/SaraRostami/University/tree/63b8ca39f91fefc349b1b93c570c8de36243c48c/Neural%20Networks%20-%20Fall%202022/Assignments" },
    { title: "Data Analysis", term: "Fall 2022", url: "https://github.com/SaraRostami/University/tree/main/Data%20Analysis%20-%20Fall%202022" },
    { title: "Introduction to Neuroscience", term: "Spring 2022", url: "" },
    { title: "Machine Learning", term: "Fall 2021", url: "https://github.com/SaraRostami/University/tree/main/Machine%20Learning%20-%20Fall%202021" },
    { title: "Statistical Inference", term: "Fall 2021", url: "https://github.com/SaraRostami/University/tree/main/Statistical%20Inference%20-%20Fall%202021" }
  ],

  experience: [
    {
      role: "Graduate Researcher",
      org: "Mohsenzadeh Lab · Western University & Vector Institute",
      url: "https://mohsenzadehlab.ca/",
      place: "London, ON, Canada",
      period: "Sep 2025 – present",
      tracks: ["academia", "industry"],
      bullets: [
        "MSc thesis on visual perception and image memorability with simultaneous EEG/fNIRS (32-channel EEG + 32 fNIRS optodes), 20+ participants.",
        "End-to-end, reproducible preprocessing and feature-extraction pipeline across all datasets.",
        "Multivariate decoding with permutation testing; neuro-inspired deep networks in PyTorch."
      ]
    },
    {
      role: "Teaching Assistant",
      org: "Western University",
      place: "London, ON, Canada",
      period: "2026",
      tracks: ["academia", "industry"],
      bullets: ["Python and Java programming."]
    },
    {
      role: "Hackathon team member",
      org: "Hack Western 12 · NeuroSentry",
      url: "https://devpost.com/software/neutro-sentry",
      place: "London, ON, Canada",
      period: "2025",
      tracks: ["industry"],
      bullets: ["Multimodal stroke-risk triage: iOS capture, FastAPI backend, guideline-grounded Gemini pipeline, React dashboard."]
    },
    {
      role: "Teaching Assistant",
      org: "Neuromatch Academy · Computational Neuroscience",
      url: "https://neuromatch.io/",
      place: "Remote",
      period: "2023, 2025, 2026",
      tracks: ["academia"],
      bullets: ["Project-pod TA (2025, 2026) and regular TA (2023): mentored international student teams through tutorials and research projects."]
    },
    {
      role: "Research Assistant",
      org: "Convergent Technologies Research Center · University of Tehran",
      place: "Tehran, Iran",
      period: "Aug 2022 – Aug 2025",
      tracks: ["academia"],
      bullets: [
        "Neural Adaptation Project: 128-channel EEG from 15 participants.",
        "MVPA and permutation testing to separate repetition and expectation effects in the vMMN."
      ]
    },
    {
      role: "Research Intern",
      org: "Genzel Lab · Donders Institute, Radboud University",
      url: "https://www.genzellab.com/",
      place: "Nijmegen, Netherlands",
      period: "Aug 2022 – Feb 2023",
      tracks: ["academia", "industry"],
      bullets: ["Compared four classifiers on physiological sleep recordings; random-forest feature importance for memory-consolidation predictors."]
    },
    {
      role: "Teaching Assistant",
      org: "University of Tehran",
      place: "Tehran, Iran",
      period: "2023",
      tracks: ["academia"],
      bullets: ["Statistical Inference; Introduction to Cognitive Neuroscience."]
    }
  ],

  education: [
    {
      degree: "MSc Neuroscience, Specialization in Machine Learning in Health and Biomedical Sciences",
      school: "Western University",
      url: "https://www.uwo.ca/",
      period: "2025 – 2027",
      note: "GPA 3.97 / 4.0 · Vector Institute–affiliated lab"
    },
    {
      degree: "MSc Artificial Intelligence & Robotics",
      school: "University of Tehran",
      url: "https://ut.ac.ir/en",
      period: "2021 – 2024",
      note: "GPA 19.12 / 20 (≈ 3.9 / 4.0) · ranked 3rd in cohort"
    },
    {
      degree: "BSc Computer Engineering",
      school: "Babol Noshirvani University of Technology",
      url: "https://nit.ac.ir/en",
      period: "2016 – 2021",
      note: "GPA 17.38 / 20"
    }
  ],

  awards: [
    { title: "Western University Graduate Funding Package", detail: "Competitive two-year funding award", year: "2025 – 2027" },
    { title: "Vector Institute Research Grant", detail: "For graduate students of Vector-affiliated faculty, recognising AI research potential", year: "2025 – 2026" },
    { title: "Ranked 3rd in cohort", detail: "MSc Artificial Intelligence & Robotics, University of Tehran", year: "2024" }
  ],

  teaching: [
    { title: "Neuromatch Academy, Computational Neuroscience", detail: "Project-pod TA 2025 & 2026 · TA 2023", links: [
      { label: "2026", url: "files/NMA_TA_Summer2026.pdf" },
      { label: "2025", url: "files/NMA_TA_Summer2025.pdf" },
      { label: "2023", url: "files/NMA_TA_Summer2023.pdf" }
    ] },
    { title: "Western University", detail: "Python and Java programming · 2026", links: [] },
    { title: "University of Tehran", detail: "Statistical Inference; Introduction to Cognitive Neuroscience · 2023", links: [] },
    { title: "Talk: Introduction to MNE-Python for EEG analysis", detail: "CuttingGardens conference, Tehran garden · Oct 2023", links: [] }
  ],

  /* "Where it applies" explorer in the Applied AI section. projects = ids above. */
  sectors: [
    {
      id: "health",
      name: "Healthcare & MedTech",
      built: "Real-time stroke-risk triage with a guideline-grounded LLM, EEG-based emotion recognition, and process mining of patient treatment pathways.",
      next: "Grounded, auditable LLM and agent workflows for clinical decision support, where calibrated confidence decides when a human must step in.",
      projects: ["neurosentry", "eeg-emotion", "data-science"]
    },
    {
      id: "trust",
      name: "Trust & safety",
      built: "Post-hoc calibration and abstention for vision-language models, explainability with SHAP, LIME and D-RISE, and adversarial robustness checks.",
      next: "Uncertainty-aware evaluation of LLMs and agents: knowing when a model should answer, defer or ask.",
      projects: ["vlm-calibration", "xai"]
    },
    {
      id: "marketing",
      name: "Marketing & advertising",
      built: "My MSc thesis studies image memorability: the neural signatures, recorded with simultaneous EEG and fNIRS, of which images people remember.",
      next: "Memorability prediction for pre-testing ads, product imagery and thumbnails, with models grounded in brain data and interpretable enough to explain why an image sticks.",
      projects: ["eeg-fnirs"]
    },
    {
      id: "neurotech",
      name: "Neurotech & BCI",
      built: "Reproducible EEG/fNIRS pipelines, multivariate decoding with permutation testing, and classifiers on physiological sleep data.",
      next: "Foundation models for neural and physiological time series.",
      projects: ["eeg-fnirs", "vmmn", "sleep", "eeg-emotion"]
    },
    {
      id: "finance",
      name: "Finance & business",
      built: "Fraud detection with deep networks, price forecasting, cohort retention analysis, and SQL/PostGIS data modelling.",
      next: "LLM-assisted analytics: retrieval-augmented and agentic workflows over structured business data.",
      projects: ["data-science", "generative"]
    }
  ]
};
