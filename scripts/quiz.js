function quiz()
		{
			
			document.getElementById("pForm").style.display = "none"
			const songsData =  JSON.parse(localStorage.getItem("songsData"));
			
			//all 3 are a dictionary maps type 
			const songsMap={};
			const lyricsMap = {};
			const artistsMap = {};
			const allArrays=[songsMap,lyricsMap,artistsMap]; //not necessary

			function createDS()
			{
				for(var item of songsData)
				{
					// Create dictionary maps for lyrics and artist arrays
					const songID = item.songId;
					
					const songName = item.songName;
					songsMap[songID] = songName;

					const artistName = item.artist;
					artistsMap[songID] = artistName;

					const lyrics = item.lyrics;
					lyricsMap[songID] = lyrics;
					
				}
				allArrays.push(songsMap, artistsMap, lyricsMap);
                
				// Iterate through each key-value pair in the lyricsMap and truncate the values
				for (const key in lyricsMap) {
					if (lyricsMap.hasOwnProperty(key)) {
						lyricsMap[key] = truncateToWords(lyricsMap[key], 10);
					}
				}
			}
			
			createDS();
			
            //חותכת את מילות השיר למספר מילים שנותנים לפונקציה
			function truncateToWords(str, numWords) 
			{
				const words = str.split(" ");
				stringToReturn = words.slice(0, numWords).join(" ");
				stringToReturn = removeLineBreaksAndDoubleSpaces(stringToReturn);
				return stringToReturn;
			}

            //מורידה רווחים ואת ה\r\
            function removeLineBreaksAndDoubleSpaces(str) 
            {
                const regexLineBreaks = /\r?\n|\r/g;
                const regexDoubleSpaces = /\s\s+/g;
                const noLineBreaksStr = str.replace(regexLineBreaks, '');
                const resultString = noLineBreaksStr.replace(regexDoubleSpaces, ' ');
                return resultString;
            }
			
			createQuastion();

			function createQuastion()
			{
				let container = document.getElementById("container");
				container.innerHTML = "";
				const whichPage = document.getElementById("whichPage");
				whichPage.innerHTML = "Let's play!";

				currentQuestion=1; 

				const quizDiv = document.createElement("div");
				quizDiv.id = "quizDiv";
				container.appendChild(quizDiv);

				const optionDiv = document.createElement("div");
				optionDiv.id = "optionDiv";
				quizDiv.appendChild(optionDiv);
				
				const questionBtn = document.createElement("BUTTON");
				questionBtn.id = "questionBtn";
				questionBtn.textContent = "Next question";
				
				questionBtn.addEventListener("click", function () {
					if(questionBtn.textContent == "Next question")
					{
						quizDiv.innerHTML = "";
						currentQuestion += 1;
						showCurrentSong(currentQuestion);
                        // Stop any ongoing speech playback
                        window.speechSynthesis.cancel();
					}

                    if (questionBtn.textContent == "check") 
                    {
                        // Get the selected radio button
                        const selectedRadioButton = document.querySelector('input[type="radio"]:checked');
                    
                        if (selectedRadioButton) 
                        {
                            // Check if the selected radio button has the "data-correct" attribute set to "true"
                            if (selectedRadioButton.getAttribute("data-correct") === "true") 
                            {
                                questionBtn.style.backgroundColor = "green";
                                questionBtn.textContent = "correct";
                                console.log("Correct answer!");
                            } 
                            else 
                            {
                                questionBtn.style.backgroundColor = "red";
                                questionBtn.textContent = "wrong";
                                //צובע את הנכון בירוק
                                const radioButtons = document.getElementsByName('radioOptions');
                                for (let i = 0; i < radioButtons.length; i++) {
                                    const radioButton = radioButtons[i];
                                    const isCorrect = radioButton.getAttribute("data-correct") === "true";
                        
                                    if (isCorrect) {
                                        // Change the style of the correct radio button's label to green
                                        const labelForCorrectOption = document.querySelector(`label[for=${radioButton.id}]`);
                                        labelForCorrectOption.style.color = "green";
                                        radioButton.style.backgroundColor = "green";
                                        radioButton.style.borderColor = "green";
                                        radioButton.style.color = "white";
                                    } else {
                                        // Reset the style of the other radio buttons' labels
                                        const labelForOption = document.querySelector(`label[for=${radioButton.id}]`);
                                        labelForOption.style.color = "";
                                        radioButton.style.borderColor = "";
                                        radioButton.style.backgroundColor = "";
                                        radioButton.style.color = "";
                                    }
                                }
                                console.log("Incorrect answer!");
                            }
                        } 
                        else
                         {
                            // No radio button is selected
                            console.log("Please select an answer.");
                        }
                      }
                      if(questionBtn.textContent == "correct" || questionBtn.textContent == "wrong")
                      {
                          setTimeout(function () {
                              questionBtn.textContent = "Next question";
                              questionBtn.disabled=false;
                              questionBtn.style.backgroundColor = 'rgb(96 73 97 / 159%)';
                          }, 1500);
                      }
					
					
				});
				
				showCurrentSong(currentQuestion);
				
				function showCurrentSong(currentQuestion) {
					quizDiv.innerHTML = "";
					
					// const songNum = document.createElement("h3");
					// songNum.id="songNum";
					// songNum.innerHTML = currentQuestion;
                    const songNum = document.createElement("BUTTON");
					songNum.id="songNum";
					songNum.textContent =  currentQuestion;
                    
                    songNum.addEventListener("mouseover",function(){
                        songNum.innerHTML = `<i class="fa fa-play"></i>`;

                    });
                    songNum.addEventListener("mouseout", function() {
                        // Change the content of the element back to the current question number when the mouse leaves the button.
                        songNum.innerHTML = currentQuestion;
                    });
                    initializeTTS();
                    songNum.addEventListener("click", function () {
                        // Call initializeTTS at the start of your application
                        
                        speakQueStr(queStr.innerHTML);
                        
                        
                    });
					let queStr = document.createElement("h3");
					queStr.id = "queStr"; 
					queStr.innerHTML = renderQuestion();
                    // speakQueStr("hello world for everyone. nice to meet you");

					quizDiv.appendChild(songNum);
					quizDiv.appendChild(queStr);
					quizDiv.appendChild(optionDiv);
					quizDiv.appendChild(questionBtn);

                    function initializeTTS() {
                        const synth = window.speechSynthesis;
                    
                        // Create a dummy utterance to trigger TTS engine initialization
                        const dummyUtterance = new SpeechSynthesisUtterance("Initializing TTS.");
                        dummyUtterance.volume = 0; // Set the volume to 0 to make it silent
                    
                        // Add an event listener for the "onvoiceschanged" event
                        synth.onvoiceschanged = function() {
                            // Trigger the dummy TTS request to initialize the engine
                            synth.speak(dummyUtterance);
                        };
                    }

                    function speakQueStr(text) {
                        const synth = window.speechSynthesis;
                        const utterance = new SpeechSynthesisUtterance(text);
                    
                        // Check if there are available voices
                        if (synth.getVoices().length > 0) {
                            // List all available voices in the console
                            console.log(synth.getVoices());
                            utterance.voice = synth.getVoices()[5]; //פה משנים מבטא!
                        }
                    
                        synth.speak(utterance);
                    }
					
				}

					function renderQuestion()
					{
						const questionDict={
							A : 'which artist perform the song #?',
							B : 'what is the name of the song that its lyrics are: \n# ?', 
							C : 'who wrote the song that goes like that # ?', 
							D : 'which song did # wrote ?'
						};
 

						//random select which question (A B C or D) selected
						const keyQue = getRandomQuestion(questionDict);
						// const keyQue = 'A';
						let returnedArray=[];
						switch (keyQue) {
							case 'A':
								returnedArray = GetTheCompleteSentence(songsMap, questionDict[keyQue]);
								//console.log("2 song id came from the function: "+returnedArray[0]);
								radioContainer = createArtistsOption(artistsMap, returnedArray[0]);
								optionDiv.innerHTML = "";
								optionDiv.appendChild(radioContainer);
								return returnedArray[2]; 
							break;
							case 'B':
								returnedArray = GetTheCompleteSentence(lyricsMap, questionDict[keyQue]);
                                radioContainer = createArtistsOption(songsMap, returnedArray[0]);
                                optionDiv.innerHTML = "";
								optionDiv.appendChild(radioContainer);
								return returnedArray[2]; 
							break;

							case 'C':
                                returnedArray = GetTheCompleteSentence(lyricsMap, questionDict[keyQue]);
                                radioContainer = createArtistsOption(artistsMap, returnedArray[0]);
                                optionDiv.innerHTML = "";
								optionDiv.appendChild(radioContainer);
								return returnedArray[2];
								break;

							case 'D':
								returnedArray = GetTheCompleteSentence(artistsMap, questionDict[keyQue]);
                                radioContainer = createArtistsOption(songsMap, returnedArray[0]);
                                optionDiv.innerHTML = "";
								optionDiv.appendChild(radioContainer);
								return returnedArray[2];
							default:
						console.log("default!");

						}
						
					}

					function getRandomQuestion(obj) { // get a random question by key
						const keys = Object.keys(obj);
						const randomIndex = Math.floor(Math.random() * keys.length);
						return keys[randomIndex]; 
					}

					function GetTheCompleteSentence(arr, question) {
						let tmpArr=[];

						const songIDs = Object.keys(arr); // מערך של מפתחות 
						const randomIndex = Math.floor(Math.random() * songIDs.length);// מגריל אינדקס
						
						const randomSongID = songIDs[randomIndex];
						const randomSongName = arr[randomSongID];

						const completeQuestion = question.replace('#', randomSongName);
						console.log("1 in the function - currrntSongID: "+randomSongID); 
						tmpArr.push(randomSongID);
						tmpArr.push(randomSongName);
						tmpArr.push(completeQuestion);
						return tmpArr;
					}
					
					function pickAndInsertRandomStrings(setOfStrings, givenString) {
						// Make a copy of the setOfStrings array to avoid modifying the original array
						const remainingStrings = [...setOfStrings];

						// Remove the givenString from the remainingStrings array (if exists)
						const indexToRemove = remainingStrings.indexOf(givenString);
						if (indexToRemove !== -1) {
							remainingStrings.splice(indexToRemove, 1);
						}

						// Pick 3 random strings from the remainingStrings array
						const pickedStrings = [];
						for (let i = 0; i < 3; i++) {
							const randomIndex = Math.floor(Math.random() * remainingStrings.length);
							const randomString = remainingStrings.splice(randomIndex, 1)[0];
							pickedStrings.push(randomString);
						}

						// Insert the givenString randomly into the pickedStrings array
						const randomInsertIndex = Math.floor(Math.random() * 4);
						pickedStrings.splice(randomInsertIndex, 0, givenString);

						return pickedStrings;
					}
					
					function createArtistsOption(arr, songID)
					{
						let quizDiv = document.getElementById("quizDiv");
						//מוצאים את השם של האופציה באמצעות הID
						let correctAnswer = arr[songID] 
						const valuesNames = Object.values(arr);
						const uniqueArray = [...new Set(valuesNames)]; //unique the array above
						let possibleAnswer = pickAndInsertRandomStrings(uniqueArray, correctAnswer);
	
						const radioContainer = document.createElement("div");
						radioContainer.innerHTML = "";
						radioContainer.id = "radioContainer";
						
						// Get the index of the correct answer radio button
  						const correctAnswerIndex = possibleAnswer.indexOf(correctAnswer);
						questionBtn.textContent = "check";

						for (let i = 0; i < possibleAnswer.length; i++) {
							const radioLabel = document.createElement("label");
							radioLabel.setAttribute("for", "radioOption" + i);
							radioLabel.textContent = possibleAnswer[i];

							const radioButton = document.createElement("input");
							radioButton.type = "radio";
							radioButton.id = "radioOption" + i;
							radioButton.name = "radioOptions";
							radioButton.value = i;

							// Add a unique identifier (e.g., data-correct) to the correct answer radio button
							if (i === correctAnswerIndex) {
								radioButton.setAttribute("data-correct", "true");
							}

							radioContainer.appendChild(radioButton);
							radioContainer.appendChild(radioLabel);
							radioContainer.appendChild(document.createElement("br"));
						}

							

							return radioContainer;
					}
		
					
                    
					
					
				

			}	
		}



  
        
