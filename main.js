const mapping = {};
let outputSlackEmojiCodes = "";
let isValidState = true;
const copyButton = document.getElementById("copy-emoji-output");
const slackAlphabetDisplayArea = document.getElementById('alphabet-display');
const statusText = document.getElementById("status");

function copyEmojiOutputToClipboard() {
    const tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = outputSlackEmojiCodes;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    statusText.className = "success";
    statusText.innerText = 'Copied to clipboard! Now just paste into Slack :)';
}

function getSlackCodeForChar(c) {
    if (c === " ") {
        return "    ";
    } else if (c === "\n") {
        isValidState = false;
        throw "Line breaks are not supported, please remove it!";
    }
    const elem = mapping[c.toLowerCase()];
    if (!elem) {
        isValidState = false;
        throw "There is no alphabet emoji for \"" + c + "\" please remove it!";
    }
    return elem.code;
}

function addImgForChar(c) {
    let elem = null;
    if (c === ' ') {
        elem = document.createElement('div')
        elem.className = "slack-alphabet-space";
    } else {
        elem = document.createElement('img');
        elem.src = mapping[c.toLowerCase()].imgUrl
        elem.className = "slack-alphabet-char"
    }
    slackAlphabetDisplayArea.appendChild(elem);
}

function onTextInput(text) {
    let output = "";
    isValidState = true;
    try {
        for (let i = 0; i < text.length; i++) {
            const slackEmojiCode = getSlackCodeForChar(text.charAt(i));
            output += slackEmojiCode;
        }
    } catch (e) {
        isValidState = false;
        output = e;
    }
    outputSlackEmojiCodes = output;
    slackAlphabetDisplayArea.innerHTML = '';
    if (text === '') {
        copyButton.disabled = true;
    } else if (isValidState) {
        copyButton.disabled = false;
        statusText.innerText = '';
        text.split("").forEach(c => addImgForChar(c));
    } else {
        copyButton.disabled = true;
        statusText.className = "error";
        statusText.innerText = output;
    }
}

function toAlphabet(c) {
    return ":alphabet-white-" + c + ":";
}

function toImgUrl(c) {
    return 'img/' + c + '.png';
}

"abcdefghijklmnopqrstuvwxyz"
    .split("")
    .forEach(c => mapping[c] = {
            code: toAlphabet(c),
            imgUrl: toImgUrl(c)
        }
    );

mapping["@"] = {
    code: toAlphabet("at"),
    imgUrl: toImgUrl('at')
};
mapping["!"] = {
    code: toAlphabet("exclamation"),
    imgUrl: toImgUrl('exclamation')
};
mapping["#"] = {
    code: toAlphabet("hash"),
    imgUrl: toImgUrl('hash')
};
mapping["?"] = {
    code: toAlphabet("question"),
    imgUrl: toImgUrl('question')
};
