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
  Object.keys(response).forEach(count => {
    htmlResult += '<div class="d-flex flex-row justify-content-start">' +
                  '<img class="img-you" src="./images/img_you.webp" alt="">' +
                  '<div>' +
                    '<p class="small p-2 ms-3 mb-1 rounded-3 theme-bg-surface">' + response[count].message + '</p>' +
                    '<p class="small ms-3 mb-3 rounded-3 text-muted">' + response[count].created_at + '</p>' +
                  '</div>' +
                '</div>' +
                '<div class="d-flex flex-row justify-content-end mb-4 pt-1">' +
                  '<div>' +
                    '<p class="small p-2 me-3 mb-1 text-white rounded-3 bg-primary">' + response[count].response + '</p>' +
                    '<p class="small me-3 mb-3 rounded-3 text-muted d-flex justify-content-end">' + response[count].created_at + '</p>' +
                  '</div>' +
                  '<img class="img-junjun" src="./images/img_junjun.webp" alt="">' +
                '</div>';
  });
  // Display Result in Div
  const div_conversation = document.getElementById('div-conversation');
  div_conversation.innerHTML = htmlResult;
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
