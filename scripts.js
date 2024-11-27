// 1st task
// wait until the page's content is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // select the left and right1 blocks
    const middle1 = document.querySelector(".middle1");
    const right2 = document.querySelector(".right2");
    // swap their html content
    const tempContent = middle1.innerHTML;
    middle1.innerHTML = right2.innerHTML;
    right2.innerHTML = tempContent;
});


// 2nd task
// parallelogram's parameters
const base = 10;
const height = 52;

// calculation of the area
function calculateParallelogramArea() {
    const area = base * height;
    // find element middle2
    const middle2 = document.querySelector('.middle2');
    // create new element for output
    const resultParagraph = document.createElement('h4');
    resultParagraph.textContent = `Parallelogram's area: ${area} square meters`;
    // add to the end of middle2
    middle2.appendChild(resultParagraph);
}

calculateParallelogramArea();


// 3rd task
document.addEventListener("DOMContentLoaded", function() {
    // check if there's a digit saved in cookies
    const maxDigit = getCookie("maxDigit");
    if (maxDigit) {
        // output saved digit and inform about deleting cookies
        alert(`Saved value: ${maxDigit}. After pressing "OK" this data will be deleted.`);
        deleteCookie("maxDigit");
        alert("Cookies deleted.");
        // reload page with original state
        location.reload();
    }
});

// function to find max digit
function findMaxDigit() {
    const numberInput = document.getElementById("numberInput").value;
    if (!numberInput) {
        alert("Enter an integer number!");
        return;
    }

    // finding max digit in a number
    const digits = numberInput.split("").map(Number);
    const maxDigit = Math.max(...digits);

    // output
    alert(`Max digit: ${maxDigit}`);

    // save in cookies
    setCookie("maxDigit", maxDigit, 1);  // save for 1 day
}

// function for setting cookies
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

// function for getting digit from cookies
function getCookie(name) {
    const cookieArr = document.cookie.split("; ");
    for (const cookie of cookieArr) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

// function for deleting cookies
function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}


// 4th task
// function for alignment
function applyAlignment(alignment) {
    const blocks = ['.left', '.right1', '.middle2'];

    blocks.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.textAlign = alignment;
        }
    });
}

// save the choice in localStorage and use the alignment
function saveAlignment(alignment) {
    localStorage.setItem('textAlignment', alignment);
    applyAlignment(alignment);
}

// use the alignment from localStorage on page load
function loadAlignment() {
    const savedAlignment = localStorage.getItem('textAlignment');
    if (savedAlignment) {
        applyAlignment(savedAlignment);

        // set up used alignment choice for radio button on page load
        const radioButton = document.querySelector(
            `input[name="alignment"][value="${savedAlignment}"]`
        );
        if (radioButton) {
            radioButton.checked = true;
        }
    }
}

// mouseout event
document.addEventListener('DOMContentLoaded', () => {
    loadAlignment();

    const form = document.getElementById('alignmentForm');
    if (form) {
        form.addEventListener('mouseout', () => {
            const selectedOption = form.querySelector(
                'input[name="alignment"]:checked'
            );
            if (selectedOption) {
                saveAlignment(selectedOption.value);
            }
        });
    }
});


// 5th task
document.addEventListener("DOMContentLoaded", () => {
    // load alignment first to apply it immediately on page load
    loadAlignment();

    const listSelectors = document.querySelectorAll(".listSelector");
    const addListButtons = document.querySelectorAll(".addListButton");
    const labels = document.querySelectorAll("label[for^='selectBlock']");

    const hideControls = () => {
        listSelectors.forEach((selector) => (selector.style.display = "none"));
        addListButtons.forEach((button) => (button.style.display = "none"));
        labels.forEach((label) => (label.style.display = "none"));
    };

    const showControls = (index) => {
        listSelectors[index].style.display = "inline-block";
        addListButtons[index].style.display = "inline-block";
        labels[index].style.display = "inline";
    };

    hideControls(); // hide all controls initially

    // function to create and add a numbered list
    const addListToBlock = (blockName, items) => {
        const block = document.querySelector(`.${blockName}`);
        if (!block) {
            alert("Block not found!");
            return;
        }

        const ol = document.createElement("ol");
        items.forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item.trim();
            ol.appendChild(li);
        });

        block.appendChild(ol);

        // save the list to localStorage for the current block
        const savedLists = JSON.parse(localStorage.getItem(blockName)) || [];
        savedLists.push(items);
        localStorage.setItem(blockName, JSON.stringify(savedLists));
    };

    // add event listeners for text selection
    const selectEventListener = (event) => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
            const block = event.currentTarget;
            const index = Array.from(block.parentNode.children).indexOf(block);
            showControls(index); // show controls on text select
        }
    };

    // add select event listeners to all selectable blocks
    document.querySelectorAll(".container > div").forEach((block) => {
        block.addEventListener("mouseup", selectEventListener);  // for desktop
        block.addEventListener("touchstart", selectEventListener); // for mobile
    });

    // add click event listeners to "add list" buttons
    addListButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            const selector = listSelectors[index];
            const blockName = selector.value;

            if (!blockName) {
                alert("Please select a block!");
                return;
            }

            const listContent = prompt("Enter list items separated by commas:");
            if (!listContent) {
                alert("The list cannot be empty!");
                return;
            }

            const items = listContent.split(",").map((item) => item.trim());
            if (items.length === 0) {
                alert("Invalid list content!");
                return;
            }

            addListToBlock(blockName, items);
        });
    });

    // load existing content from localStorage when the page loads
    for (const [blockName, listData] of Object.entries(localStorage)) {
        if (blockName !== 'textAlignment') { // Avoid overwriting alignment
            const block = document.querySelector(`.${blockName}`);
            if (block) {
                const savedLists = JSON.parse(listData);
                savedLists.forEach((items) => {
                    const ol = document.createElement("ol");
                    items.forEach((item) => {
                        const li = document.createElement("li");
                        li.textContent = item.trim();
                        ol.appendChild(li);
                    });
                    block.appendChild(ol);
                });
            }
        }
    }
    
    window.addEventListener("beforeunload", () => {
        // don't clear the text alignment data
        for (const [key] of Object.entries(localStorage)) {
            if (key !== 'textAlignment') {
                localStorage.removeItem(key);
            }
        }
    });
});






