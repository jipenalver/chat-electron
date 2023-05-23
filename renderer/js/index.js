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
    btn_submit.innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>';
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
    const response = await window.axios.openAI(convo);
    // Check Error if it exist
    if( response.error ) {
      alertMessage("error", response.error.message);
      return;
    }
    // Set AI Response
    let result = response.choices[0].text.trim();
    console.log(convo + result);
    conversation.push({
      You: message,
      Junjun: result
    });
    // Concatenate AI Response
    // conversation += response.choices[0].text + '\n';
    // Display Conversation
    // setChatbox(conversation);
    // Store to database the prompt and result
    // const backend = await window.axios.backend('post', 'login', {
    //   email: formData.get("email"),
    //   password: formData.get("password"),
    // } );
    // Enable Submit Button
    btn_submit.innerHTML = '<img src="./images/ic_plane.png" width="30" height="30" alt="">';
    btn_submit.disabled = false;
  };
}

function setChatbox (response) {
  let htmlResult = '';
  text.split(" ");

  // Object.keys(response).forEach(key => {
  //     let date = new Date(response[key].created_at.replace(' ', 'T'));

  //     htmlResult += '<tr>' +
  //         '<th scope="row">' +  response[key].prompt_id + '</th>' +
  //         '<td>' + response[key].tools_type + '</td>' +
  //         '<td>' + response[key].text + '</td>' +
  //         '<td>' + response[key].result + '</td>' +
  //         '<td>' + date.toLocaleString('en-US', { timeZone: 'UTC' }) + '</td>' +
  //         '<td>' + 
  //             '<div class="btn-group" role="group">' +
  //                 '<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">' +
  //                     'Action' +
  //                 '</button>' +
  //                 '<ul class="dropdown-menu">' +
  //                     '<li><a id="btn_prompts_del" class="dropdown-item" href="#" name="' + response[key].prompt_id + '">Remove</a></li>' +
  //                 '</ul>' +
  //             '</div>' +
  //     '</tr>';
  // });

  const tbody = document.getElementById('tbl_prompts');
  tbody.innerHTML = htmlResult;
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
