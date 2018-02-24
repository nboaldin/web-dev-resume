var element = document.getElementsByTagName("a"), index;

for (index = element.length - 1; index >= 0; index--) {
    element[index].parentNode.removeChild(element[index]);
}
