document.addEventListener('DOMContentLoaded', function() {
    // Helper functions
    function hideAll(sections) {
        sections.forEach(function(section) {
            section.style.display = "none";
        });
    }

    function showSection(sections, prefix, index) {
        hideAll(sections);
        var section = document.querySelector("#" + prefix + index);
        if (section) {
            section.style.display = "block";
        } else {
            console.error("Section with ID " + prefix + index + " not found.");
        }
    }

    function addEventListeners(buttons, sections, prefix) {
        buttons.forEach(function(btn, index) {
            btn.addEventListener("click", function() {
                showSection(sections, prefix, index + 1);
            });
        });
    }

    function initializeSections(sections, prefix) {
        hideAll(sections);
        showSection(sections, prefix, 1);  // Show the first section by default
    }

    // Navigation for main pages
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('.page-section');

    function showPageSection(sectionId) {
        sections.forEach(function(section) {
            section.classList.toggle('active', section.id === sectionId);
        });
    }

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            var targetSection = this.getAttribute('href').substring(1);
            showPageSection(targetSection);

            // Close the off-screen menu after selecting a link
            offScreenMenu.classList.remove('active');
            hamMenu.classList.remove('active');
        });
    });

    showPageSection('home'); // Show the home section by default

    // Type of natural disasters
    var typeBtns = [
        document.querySelector("#page1btn"),
        document.querySelector("#page2btn"),
        document.querySelector("#page3btn")
    ];
    var allTypePages = document.querySelectorAll(".typepage");
    initializeSections(allTypePages, "type");
    addEventListeners(typeBtns, allTypePages, "type");

    // Long-term earthquake mitigation
    var ltEqMitBtns = [
        document.querySelector("#eqm1btn"),
        document.querySelector("#eqm2btn"),
        document.querySelector("#eqm3btn"),
        document.querySelector("#eqm4btn")
    ];
    var allLtEqMitigations = document.querySelectorAll(".eqmitigationlt");
    initializeSections(allLtEqMitigations, "lt_eqm");
    addEventListeners(ltEqMitBtns, allLtEqMitigations, "lt_eqm");

    // Short-term earthquake mitigation
    var stEqMitBtns = [
        document.querySelector("#eqm5btn"),
        document.querySelector("#eqm6btn")
    ];
    var allStEqMitigations = document.querySelectorAll(".eqmitigationst");
    initializeSections(allStEqMitigations, "st_eqm");
    addEventListeners(stEqMitBtns, allStEqMitigations, "st_eqm");

    // Long-term flood mitigation
    var ltFloodMitBtns = [
        document.querySelector("#floodm1btn"),
        document.querySelector("#floodm2btn"),
        document.querySelector("#floodm3btn")
    ];
    var allLtFloodMitigations = document.querySelectorAll(".floodmitigationlt");
    initializeSections(allLtFloodMitigations, "lt_floodm");
    addEventListeners(ltFloodMitBtns, allLtFloodMitigations, "lt_floodm");

    // Short-term flood mitigation
    var stFloodMitBtns = [
        document.querySelector("#floodm4btn"),
        document.querySelector("#floodm5btn")
    ];
    var allStFloodMitigations = document.querySelectorAll(".floodmitigationst");
    initializeSections(allStFloodMitigations, "st_floodm");
    addEventListeners(stFloodMitBtns, allStFloodMitigations, "st_floodm");

    // Quiz game logic
    var quizData = [
        { question: "What causes an earthquake?", choices: ["Heavy rainfall", "Movement of tectonic plates", "Strong winds", "Volcanic eruption"], correct: 1 },
        { question: "Which of these is a long-term flood mitigation method?", choices: ["Evacuation routes", "Flood forecasting", "Building levees", "Public awareness campaigns"], correct: 2 },
        { question: "What is the primary cause of floods?", choices: ["Earthquake", "Heavy rainfall", "Tsunami", "Wildfire"], correct: 1 }
    ];

    var currentQuestion = 0;
    var score = 0;

    var questionElement = document.getElementById('question');
    var choicesElement = document.getElementById('choices');
    var restartButton = document.getElementById('restart-btn');

    function loadQuestion() {
        var currentQuiz = quizData[currentQuestion];
        questionElement.textContent = currentQuiz.question;
        choicesElement.innerHTML = '';
        currentQuiz.choices.forEach(function(choice, index) {
            var button = document.createElement('button');
            button.textContent = choice;
            button.classList.add('choice-btn');
            button.addEventListener('click', function() {
                selectAnswer(index);
            });
            choicesElement.appendChild(button);
        });
    }

    function selectAnswer(selected) {
        var currentQuiz = quizData[currentQuestion];
        if (selected === currentQuiz.correct) score++;
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showScore();
        }
    }

    function showScore() {
        questionElement.textContent = "You scored " + score + " out of " + quizData.length;
        choicesElement.innerHTML = '';
    }

    restartButton.addEventListener('click', function() {
        currentQuestion = 0;
        score = 0;
        loadQuestion();
    });

    loadQuestion();

    // Game logic
    var disasterDropdown = document.getElementById('disaster-dropdown');
    var budgetElement = document.getElementById('budget');
    var methodsList = document.getElementById('methods-list');
    var selectedMethodsList = document.getElementById('selected-methods-list');
    var finalizePlanButton = document.getElementById('finalize-plan');
    var restartGameButton = document.getElementById('restart-game');
    var resultText = document.getElementById('result-text');
    var resultSection = document.getElementById('result');

    var budget = 10000;
    var selectedMethods = [];
    var currentLevel = 1;
    var maxLevel = 3;

    var mitigationMethods = {
        earthquake: [
            { name: 'Building Reinforcement', cost: 3000, effectiveness: 30 },
            { name: 'Seismic Isolation', cost: 5000, effectiveness: 50 },
            { name: 'Emergency Kits', cost: 1000, effectiveness: 10 },
        ],
        flood: [
            { name: 'Levee Construction', cost: 7000, effectiveness: 70 },
            { name: 'Flood Warning System', cost: 2000, effectiveness: 20 },
            { name: 'Evacuation Plan', cost: 1500, effectiveness: 15 },
        ],
        volcano: [
            { name: 'Lava Diversion', cost: 6000, effectiveness: 60 },
            { name: 'Ash Clean-up', cost: 2000, effectiveness: 20 },
            { name: 'Emergency Shelters', cost: 3000, effectiveness: 30 },
        ],
    };

    function updateMethodsList() {
        var selectedDisaster = disasterDropdown.value;
        methodsList.innerHTML = '';
        mitigationMethods[selectedDisaster].forEach(function(method, index) {
            var li = document.createElement('li');
            li.textContent = method.name + " - $" + method.cost;
            var addButton = document.createElement('button');
            addButton.textContent = 'Add';
            addButton.addEventListener('click', function() {
                addMethod(selectedDisaster, index);
            });
            li.appendChild(addButton);
            methodsList.appendChild(li);
        });
    }

    function addMethod(disaster, methodIndex) {
        var method = mitigationMethods[disaster][methodIndex];
        if (budget >= method.cost) {
            selectedMethods.push(method);
            budget -= method.cost;
            updateBudget();
            updateSelectedMethods();
        } else {
            alert('Not enough budget');
        }
    }

    function updateBudget() {
        budgetElement.textContent = budget;
    }

    function updateSelectedMethods() {
        selectedMethodsList.innerHTML = '';
        selectedMethods.forEach(function(method, index) {
            var li = document.createElement('li');
            li.textContent = method.name + " - $" + method.cost;
            var removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', function() {
                removeMethod(index);
            });
            li.appendChild(removeButton);
            selectedMethodsList.appendChild(li);
        });
    }

    function removeMethod(methodIndex) {
        var method = selectedMethods[methodIndex];
        budget += method.cost;
        selectedMethods.splice(methodIndex, 1);
        updateBudget();
        updateSelectedMethods();

        // Check if budget is positive after removal
        ensurePositiveBudget();
    }

    function randomEvent(disaster) {
        var events = {
            earthquake: [
                "Aftershock increased costs by $2000",
                "Improved building codes reduced costs by $1000",
                "Community donations provided additional $500",
                "Structural damages increased costs by $3000"
            ],
            flood: [
                "Rising flood waters increased costs by $2000",
                "Innovative flood barriers reduced costs by $1000",
                "Community fundraisers provided additional $500",
                "Severe weather increased costs by $3000"
            ],
            volcano: [
                "Unexpected volcanic activity increased costs by $2000",
                "Improved lava diversion reduced costs by $1000",
                "Government grants provided additional $500",
                "Ashfall damages increased costs by $3000"
            ]
        };
    
        var disasterEvents = events[disaster];
        var eventIndex = Math.floor(Math.random() * disasterEvents.length);
        var eventMessage = disasterEvents[eventIndex];
        
        // Extract cost change from the event message
        var costChange = parseInt(eventMessage.match(/-?\d+/));
        
        // Determine if the cost change should be added or subtracted
        if (eventMessage.includes('reduced') || eventMessage.includes('provided')) {
            // Positive event
            budget += costChange;
        } else {
            // Negative event
            budget -= costChange;
        }
        
        // Show event message and update budget
        alert(eventMessage);
        updateBudget();
    }

    function calculateEffectiveness() {
        var totalEffectiveness = 0;
        selectedMethods.forEach(function(method) {
            totalEffectiveness += method.effectiveness;
        });
        return Math.min(totalEffectiveness, 100);  // Cap the effectiveness at 100%
    }

    function countMethods(methods) {
        var countMap = {};
        methods.forEach(function(method) {
            if (countMap[method.name]) {
                countMap[method.name]++;
            } else {
                countMap[method.name] = 1;
            }
        });
        return countMap;
    }
    
    function formatMethodList(methods) {
        var countMap = countMethods(methods);
        return Object.keys(countMap).map(function(methodName) {
            var count = countMap[methodName];
            return (count > 1 ? count + 'x ' : '') + methodName;
        }).join(', ');
    }

    function finalizePlan() {
        if (!ensurePositiveBudget()) {
            alert("Your budget is non-positive. Please remove some mitigation methods to proceed.");
            return; // Prevent moving to the next level if the budget is non-positive
        }
    
        var selectedDisaster = disasterDropdown.value;
        var effectiveness = calculateEffectiveness();  // Calculate effectiveness based on selected methods
        score += effectiveness;
        resultSection.style.display = 'block';
        resultText.textContent = "For the " + selectedDisaster + ", you have selected the following methods: " + formatMethodList(selectedMethods) + ". You have $" + budget + " remaining. Effectiveness: " + effectiveness + "%. Total Score: " + score;
        
        if (currentLevel < maxLevel) {
            currentLevel++;
            finalizePlanButton.textContent = 'Next Level';
        } else {
            finalizePlanButton.style.display = 'none';
            restartGameButton.style.display = 'inline-block';
        }
        
        randomEvent(selectedDisaster);
    }

    function ensurePositiveBudget() {
        if (budget < 0) {
            alert("You need to remove some mitigation methods to maintain a positive budget.");
            return false; // Indicate that the budget is not positive
        }
        return true; // Budget is positive
    }
    

    function resetGame() {
        budget = 10000;
        selectedMethods = [];
        currentLevel = 1;
        score = 0;
        disasterDropdown.value = 'earthquake';
        updateMethodsList();
        updateBudget();
        updateSelectedMethods();
        resultSection.style.display = 'none';
        finalizePlanButton.style.display = 'inline-block';
        restartGameButton.style.display = 'none';
        finalizePlanButton.textContent = 'Finalize Plan';
    }

    disasterDropdown.addEventListener('change', updateMethodsList);
    finalizePlanButton.addEventListener('click', function() {
        if (ensurePositiveBudget()) {
            finalizePlan();
        }
    });
    restartGameButton.addEventListener('click', resetGame);

    updateMethodsList();

    // Hamburger menu toggle
    var hamMenu = document.querySelector('.ham-menu');
    var offScreenMenu = document.querySelector('.off-screen-menu');

    hamMenu.addEventListener('click', function() {
        offScreenMenu.classList.toggle('active');
        hamMenu.classList.toggle('active');
    });

    // Move quiz section to mitigation section
    var quizSection = document.getElementById('quiz');
    var mitigationSection = document.getElementById('mitigation');
    mitigationSection.appendChild(quizSection);
});
