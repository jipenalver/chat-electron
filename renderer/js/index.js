// Btn Continue
const btn_continue = document.getElementById("btn_continue");
if (btn_continue) {
  btn_continue.onclick = function (e) {
    // Hide Intro Area and Show ChatBox
    const intro_area = document.getElementById("intro-area");
    const chat_area = document.getElementById("chat-area");
    intro_area.classList.add('d-none');
    chat_area.classList.remove('d-none');
    chat_area.classList.add('d-flex');
    // Show Latest Chat
    const div_conversation = document.getElementById('div-conversation');
    div_conversation.scrollTo(0, div_conversation.scrollHeight);
    // Focus Input Type Message
    const txt_message = document.getElementById('txt_message');
    txt_message.focus();
  }
}

// Initialize Conversation Array
let conversation = [];
// Btn Submit
const btn_submit = document.getElementById("btn_submit");
if (btn_submit) {
  btn_submit.onclick = async function (e) {
    // Get Text from Message
    const txt_message = document.getElementById('txt_message');
    let message = txt_message.value;
    txt_message.value = '';
    // Check if text is not empty
    if (message.length < 2) {
      alertMessage("error", "Please type any message!");
      return;
    }
    // Set Load on Button
    btn_submit.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
    btn_submit.disabled = true;
    // Set conversation if there are already
    let convo = '';
    if (Object.keys(conversation).length >= 1) {
      Object.keys(conversation).forEach(key => {
        convo += 'You: ' + conversation[key].You + '\nJunjun: ' + conversation[key].Junjun + '\n';
      });
      convo += 'You: ' + message + '\nJunjun: ';
    }
    else {
      convo = 'You: ' + message + '\nJunjun: ';
    }
    // Access OpenAI alongside the prompt
    const result = await window.axios.openAI(convo);
    // Check Error if it exist
    if( result.error ) {
      alertMessage("error", result.error.message);
      return;
    }
    // Set AI Response
    let response = result.choices[0].text.trim();
    console.log(convo + response);
    conversation.push({
      You: message,
      Junjun: response
    });
    // Store to database the prompt and result
    const store_response = await window.axios.backend('post', 'prompts', {
        message: message,
        response: response,
      });
    console.log(store_response);
    // Reload Chatbox
    setChatbox();
    // Enable Submit Button
    btn_submit.innerHTML = '<img src="./images/ic_plane.png" width="30" height="30" alt="">';
    btn_submit.disabled = false;
  };
}

// Load Chatbox
setChatbox();
// Callback Func for Chatbox
async function setChatbox () {
  // Retrieve Data from Backend API's Database
  const response = await window.axios.backend('get', 'prompts');
  // Load result in Div
  let htmlResult = '';
  let isToday = false;
  Object.keys(response).forEach(count => {
    let created_at = new Date(response[count].created_at);
    // Check the created date if it is today's date
    if ( created_at.getDate() == new Date().getDate() && !isToday ) {
      htmlResult += '<div class="divider d-flex align-items-center mb-4">' +
                      '<p class="text-center mx-3 mb-0">Today</p>' +
                    '</div>';
      isToday = true;
    }
    // Set Time or Date based on Created At
    let date = created_at.toLocaleString('en-US', { timeZone: 'Asia/Manila' });
    let time = created_at.toLocaleTimeString('en-US', { timeZone: 'Asia/Manila' });
    htmlResult += '<div class="d-flex flex-row justify-content-end">' +
                  '<div>' +
                    '<p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">' + response[count].message + '</p>' +
                    '<p class="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">' + ( isToday ? time : date ) + '</p>' +
                  '</div>' +
                  '<img class="img-junjun" src="./images/img_you.png" alt="">' +
                '</div>' +
                '<div class="d-flex flex-row justify-content-start mb-4 pt-1">' +
                  '<img class="img-you" src="./images/img_junjun.png" alt="">' +
                  '<div>' +
                    '<p class="small p-2 ms-3 mb-1 rounded-3 theme-bg-surface">' + response[count].response + '</p>' +
                    '<p class="small ms-3 mb-3 rounded-3 text-muted">' + ( isToday ? time : date ) + '</p>' +
                  '</div>' +
                '</div>';
  });
  // Display Result in Div
  const div_conversation = document.getElementById('div-conversation');
  div_conversation.innerHTML = htmlResult;
  div_conversation.scrollTo(0, div_conversation.scrollHeight);
}

// Alert Message
function alertMessage(status, sentence){
  window.Toastify.showToast({
    text: sentence,
    duration: 3000,
    stopOnFocus: true,
    style: {
      textAlign: "center",
      background: status == "error" ? "#E76161":"#539165",
      color: "white",
      padding: "5px",
      marginTop: "2px"
    }
  });
}
