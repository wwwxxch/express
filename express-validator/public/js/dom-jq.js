/* ------------------------------------------------------------------- */
// Show SignIn form or SignUp form
const $showmsg = $('#reminder');
const $showinstr = $('#instruction');
const $signinClick = $('.show-signin');
const $signupClick = $('.show-signup');
const $signindiv = $('#sign-in');
const $signupdiv = $('#sign-up');

// CLICK SignIn BUTTON
$signinClick.click(() => {
  // show SignIn(OLD) form & hide SignUp(NEW) form
  $signindiv.css('display', 'flex');
  $signupdiv.css('display', 'none');

  $showinstr.css('display', 'block');
  $showinstr.text('SIGN-IN');

  $showmsg.css('display', 'block');
  $showmsg.text('');

  $('.oldemail').val('');
  $('.oldpwd').val('');
});

// CLICK SignUp BUTTON
$signupClick.click(() => {
  // show SignUp(NEW) form & hide SignIn(OLD) form
  $signupdiv.css('display', 'flex');
  $signindiv.css('display', 'none');

  $showinstr.css('display', 'block');
  $showinstr.text('SIGN-UP');

  $showmsg.css('display', 'block');
  $showmsg.text('');

  $('.newname').val('');
  $('.newemail').val('');
  $('.newpwd').val('');
  $('.pwdconf').val('');
});

/* ------------------------------------------------------------------- */
// Submit inputs via AJAX & CLICK event
const $oldClick = $('.oldsubmit');
const $newClick = $('.newsubmit');

function clickfunc (typ) {
  $showmsg.text('');
  // pass input value via json format
  let params;
  // send post request to different routes
  let url;
  // setup parameters
  if (typ === 'old') {
    const inputval_olde = $('.oldemail').val();
    const inputval_oldp = $('.oldpwd').val();

    params = {
      oldemail: inputval_olde,
      oldpwd: inputval_oldp
    };
    url = '/signin';
  } else if (typ === 'new') {
    const inputval_newn = $('.newname').val();
    const inputval_newe = $('.newemail').val();
    const inputval_newp = $('.newpwd').val();
    const inputval_newpconf = $('.pwdconf').val();

    params = {
      newname: inputval_newn,
      newemail: inputval_newe,
      newpwd: inputval_newp,
      newpconf: inputval_newpconf
    };
    url = '/signup';
  };

  // AJAX
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const serverres = xhr.responseText;

      // **SignIn (OLD) - action based on server response
      if (typ === 'old') {
        if (serverres.includes('member')) {
          alert('Login Successful!');
          location.replace(`${serverres}`);
        } else {
          const msg = JSON.parse(serverres);
          msg.msg.map((item) => {
            return $showmsg.append(`<li>${item}</li>`);
          });
        }

      // **SignUp (NEW) - action based on server response
      } else if (typ === 'new') {
        if (serverres.includes('member')) {
          alert('Signup Successful!');
          location.replace(`${serverres}`);
        } else {
          const msg = JSON.parse(serverres);
          msg.msg.map((item) => {
            return $showmsg.append(`<li>${item}</li>`);
          });
        };
      }
    }
  };
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(params));
}

$oldClick.click((e) => {
  e.preventDefault();
  clickfunc('old');

  $('.oldemail').val('');
  $('.oldpwd').val('');
});
$newClick.click((e) => {
  e.preventDefault();
  clickfunc('new');

  $('.newemail').val('');
  $('.newpwd').val('');
  $('.pwdconf').val('');
});
