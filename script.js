let sortableListClass = "sortable-list";
let listItemClass = "item";
let dragElementClass = "dragblock";
let onDragClass = "on-drag";

let sortableList = null;
let listItems = null;
let dragItems = null;

let scrollSpeed = 15;
let draggedElement = null;

// INITIALIZE

window.onload = () => {
    sortableList = document.querySelector(`.${sortableListClass}`);
    sortableList.addEventListener("dragover", handleDragMove);

    dragItems = sortableList.querySelectorAll(`.${dragElementClass}`);
    dragItems.forEach((el) => {
        el.addEventListener("touchstart", handleTouchStart);
        el.addEventListener("touchend", handleTouchEnd);
        el.addEventListener("touchmove", handleTouchMove);        
    });

    listItems = sortableList.querySelectorAll(`.${listItemClass}`);
    listItems.forEach((el) => {
        el.addEventListener("dragstart", handleDragStart);
        el.addEventListener("dragend", handleDragEnd)
    });

    window.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });
};


// EVENT HANDLERS

const handleTouchStart = (e) => {
    e.preventDefault();
    draggedElement = findDraggedListItem(e.target);
    draggedElement.classList.add(onDragClass);
}

const handleTouchEnd = (e) => {
    draggedElement.classList.remove(onDragClass);
    draggedElement = null;
}

const handleTouchMove = (e) => {
    if (draggedElement) {
        moveDraggedElement(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    }
}

const handleDragStart = (e) => {
    const dragElement = document.elementFromPoint(e.clientX, e.clientY);
    if (!draggedElement && dragElement.classList.contains(dragElementClass)) {
        draggedElement = e.target;
        draggedElement.classList.add(onDragClass);
    }
}

const handleDragMove = (e) => {
    if (draggedElement) {
        e.preventDefault();
        moveDraggedElement(e.clientX, e.clientY);
    }
}

const handleDragEnd = (e) => {
    if (draggedElement) {
        draggedElement.classList.remove("on-drag");
        draggedElement = null;
    }
}


// UTILITY FUNCTIONS

const findDraggedListItem = (element) => {
    while (element.parentNode) {
        if (element.classList.contains(listItemClass)) {
            return element;
        }
        element = element.parentNode;
    }
    return null;
}

const findListItemOnPosition = (x, y) => {
    let targetElements = document.elementsFromPoint(x, y);
    for (let i = 0; i < targetElements.length; i++) {
        if (targetElements[i].classList.contains(listItemClass)) {
            return targetElements[i];
        }
    }
    return null;
}

const moveDraggedElement = (x, y) => {
    let targetElement = findListItemOnPosition(x, y);
    if (targetElement) {
        let elementRect = targetElement.getBoundingClientRect();
        let elementMidPoint = elementRect.top + (elementRect.bottom - elementRect.top) / 2;
        let isBelowMidPoint = y > elementMidPoint;
        if (isBelowMidPoint) {
            targetElement.after(draggedElement);
        } else {
            targetElement.before(draggedElement);
        }
        scrollWindowIfNeeded(y);
    }
}

const scrollWindowIfNeeded = (y) => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    if (windowHeight < documentHeight) {
        if (y > windowHeight - 50) {
            window.scrollBy(0, scrollSpeed);
        }
        if (y < 50) {
            window.scrollBy(0, -scrollSpeed);
        }
    }   
}