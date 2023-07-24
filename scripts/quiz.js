function quiz()
		{
			document.getElementById("pForm").style.display = "none"
			const songsData =  JSON.parse(localStorage.getItem("songsData"));
			
			//all 3 are a dictionary maps type 
			const songsMap={};
			const lyricsMap = {};
			const artistsMap = {};

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
                
				// Iterate through each key-value pair in the lyricsMap and truncate the values
				for (const key in lyricsMap) {
					if (lyricsMap.hasOwnProperty(key)) {//מוודא שלמפתח יש ערך ייחודי 
						lyricsMap[key] = cutFirstWords(lyricsMap[key], 10);
					}
				}
			}
			
			createDS();
			
            //חותכת את מילות השיר למספר מילים שנותנים לפונקציה
			function cutFirstWords(str, numWords) 
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
			
			createQuestion();

			function createQuestion()
			{
				let container = document.getElementById("container");
				container.innerHTML = "";
				const whichPage = document.getElementById("whichPage");
				whichPage.innerHTML = "Let's play!";

				const quizDiv = document.createElement("div");
				quizDiv.id = "quizDiv";
				container.appendChild(quizDiv);

				const optionDiv = document.createElement("div");
				optionDiv.id = "optionDiv";
				quizDiv.appendChild(optionDiv);
				
				const questionBtn = document.createElement("BUTTON");
				questionBtn.id = "questionBtn";
				
				questionBtn.addEventListener("click", function () {
					if(questionBtn.textContent == "Next question")
					{
						quizDiv.innerHTML = "";
						showCurrentSong();
                        window.speechSynthesis.cancel(); // Stop ongoing speech playback
					}

                    if (questionBtn.textContent == "Check") 
                    {
                        // Catch the selected radio button
                        const selectedRadioButton = document.querySelector('input[type="radio"]:checked');
                    
                        if (selectedRadioButton) 
                        {
                            // Check if the selected radio button has the "data-correct" attribute set to "true"
                            if (selectedRadioButton.getAttribute("data-correct") === "true") 
                            {
                               	questionBtn.style.backgroundColor = "#52c01b";
							   	questionBtn.style.textShadow = "0 0 3px #60c627, 0 0 10px #60c627, 0 0 20px #60c627;";
                                questionBtn.textContent = "Correct";
                            } 
                            else 
                            {
                                questionBtn.style.backgroundColor = "red";
								questionBtn.style.textShadow = "0 0 3px #FF0000, 0 0 10px #FF0000, 0 0 20px #FF0000;";
								questionBtn.textContent = "Wrong";

                                // paint the radio button and the label of the correct answer in green
                                const radioButtons = document.getElementsByName('radioOptions');
                                for (let i = 0; i < radioButtons.length; i++) {
                                    const radioButton = radioButtons[i];
                                    const isCorrect = radioButton.getAttribute("data-correct") === "true";
                        
                                    if (isCorrect) {
                                        // Change the style of the correct radio button's label and button to green
                                        const labelForCorrectOption = document.querySelector(`label[for=${radioButton.id}]`);
                                        labelForCorrectOption.style.color = "#52c01b";
                                        radioButton.style.backgroundColor = "#52c01b";
                                        radioButton.style.borderColor = "#52c01b";
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
                            }
                        } 
                        else
                         {
                            // No radio button is selected
                            console.log("Please select an answer.");
                        }
                      }
                      if(questionBtn.textContent == "Correct" || questionBtn.textContent == "Wrong")
                      {
                          setTimeout(function () {
                              questionBtn.textContent = "Next question";
							  questionBtn.style.backgroundColor = "rgb(8 18 30)";
                              questionBtn.disabled=false;
                              
                          }, 1500);
                      }
				});
				
				showCurrentSong();
				
				//builds the question and answers divs
				function showCurrentSong() {
					quizDiv.innerHTML = "";
                    const playBtn = document.createElement("BUTTON");
					playBtn.id="songNum";
					
					playBtn.innerHTML = `<i class="fa fa fa-play"></i>`;
                    
                    initializeTTS(); //פונקציה שמפעילה את הקול בסאונד 0 בשביל למנוע עיוותי קול
					
                    playBtn.addEventListener("click", function () {
						speakQueStr(queStr.innerHTML);
					});	

					let queStr = document.createElement("h3");
					queStr.id = "queStr"; 
					queStr.innerHTML = createContentToQuestion();

					quizDiv.appendChild(playBtn);
					quizDiv.appendChild(queStr);
					quizDiv.appendChild(optionDiv);
					quizDiv.appendChild(questionBtn);

					//Turning the audio of the question in sound 0
                    function initializeTTS() {
                        const synth = window.speechSynthesis; //מאפשר את הפונקציונליות לדיבור מהדפדפן

                        const dummyUtterance = new SpeechSynthesisUtterance("Initializing TTS"); //speach the text - Initializing TTS
                        dummyUtterance.volume = 0; // set the volume to 0 to make it silent
                    
                        // מופעלת כאשר הדפדפן עולה ונטענים הקולות
                        synth.onvoiceschanged = function() {
                            synth.speak(dummyUtterance); //מפעילה את הדאמי טקסט שהגדרנו
                        };
                    }

                    function speakQueStr(text) {
                        const synth = window.speechSynthesis; //מאפשר את הפונקציונליות לדיבור מהדפדפן
                        const utterance = new SpeechSynthesisUtterance(text); //constructor to TTS 
                    
                        if (synth.getVoices().length > 0) {// Check if there are available voices
                            utterance.voice = synth.getVoices()[0]; //הקול שמקריא
                        }

                        synth.speak(utterance); // פקודה להקראה
                    }
					
				}

					//Create and retrun the complete question - מחזירה את השאלה השלמה
					function createContentToQuestion()
					{
						const questionDict={
							A : 'Which artist perform the song #?',
							B : 'What is the name of the song that its lyrics are: \n# ?', 
							C : 'Who preform the song that goes like that # ?', 
							D : 'Which song did # wrote ?'
						};
 
						//random select which question (A B C or D) selected
						const keyQue = getRandomQuestion(questionDict);
						let returnedArray=[];
						switch (keyQue) {
							case 'A':
								returnedArray = GetTheCompleteSentence(songsMap, questionDict[keyQue]);
								radioContainer = createAnswerOption(artistsMap, returnedArray[0]);
								optionDiv.innerHTML = "";
								optionDiv.appendChild(radioContainer);
								return returnedArray[2]; 
							break;
							case 'B':
								returnedArray = GetTheCompleteSentence(lyricsMap, questionDict[keyQue]);
                                radioContainer = createAnswerOption(songsMap, returnedArray[0]);
                                optionDiv.innerHTML = "";
								optionDiv.appendChild(radioContainer);
								return returnedArray[2]; 
							break;

							case 'C':
                                returnedArray = GetTheCompleteSentence(lyricsMap, questionDict[keyQue]);
                                radioContainer = createAnswerOption(artistsMap, returnedArray[0]);
                                optionDiv.innerHTML = "";
								optionDiv.appendChild(radioContainer);
								return returnedArray[2];
								break;

							case 'D':
								returnedArray = GetTheCompleteSentence(artistsMap, questionDict[keyQue]);
                                radioContainer = createAnswerOption(songsMap, returnedArray[0]);
                                optionDiv.innerHTML = "";
								optionDiv.appendChild(radioContainer);
								return returnedArray[2];
							default:
						console.log("default!");

						}
						
					}

					function getRandomQuestion(obj) { // מגרילה אות לשאלה
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
						tmpArr.push(randomSongID);
						tmpArr.push(randomSongName);
						tmpArr.push(completeQuestion);
						return tmpArr;
					}
					
					function pickAndInsertRandomStrings(setOfStrings, correctString) {
						// make a copy of the setOfStrings array to avoid modifying the original array
						const remainingStrings = [...setOfStrings]; //spread opertor - creats new individual items

						// Remove the correctString from the remainingStrings array (if exists)
						const indexToRemove = remainingStrings.indexOf(correctString);
						if (indexToRemove !== -1) {
							remainingStrings.splice(indexToRemove, 1);
						}

						// Pick 3 random strings from the remainingStrings array
						const pickedStrings = [];
						for (let i = 0; i < 3; i++) {
							const randomIndex = Math.floor(Math.random() * remainingStrings.length);
							const randomString = remainingStrings.splice(randomIndex, 1)[0]; //remove the random option - one element to remove
							pickedStrings.push(randomString);
						}

						// Insert the correctString randomly into the pickedStrings array
						const randomInsertIndex = Math.floor(Math.random() * 4);
						pickedStrings.splice(randomInsertIndex, 0, correctString); //מכניס בצורה רנדומלית את המחרוזת הנכונה למערך
						return pickedStrings;
					}
					
					function createAnswerOption(arr, songID)
					{
						let correctAnswer = arr[songID] //מוצאים את הערך עצמו של האופציה באמצעות הID
						const valuesNames = Object.values(arr);
						const uniqueArray = [...new Set(valuesNames)]; //Set - unique the array above and use the spread operator (...)
						let possibleAnswer = pickAndInsertRandomStrings(uniqueArray, correctAnswer);
	
						const radioContainer = document.createElement("div");
						radioContainer.innerHTML = "";
						radioContainer.id = "radioContainer";
						
						// Get the index of the correct answer radio button
  						const correctAnswerIndex = possibleAnswer.indexOf(correctAnswer);
						questionBtn.textContent = "Check";

						for (let i = 0; i < possibleAnswer.length; i++) {
							const radioLabel = document.createElement("label");
							radioLabel.setAttribute("for", "radioOption" + i);
							radioLabel.textContent = possibleAnswer[i];

							const radioButton = document.createElement("input");
							radioButton.type = "radio";
							radioButton.id = "radioOption" + i;
							radioButton.name = "radioOptions";
							radioButton.value = i;

							// Add a unique identifier (data-correct) to the correct answer radio button
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



  
        
