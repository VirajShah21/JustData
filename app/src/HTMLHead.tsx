/**
 * Assigns a title to the HTML `<title>` element.
 *
 * @param title - The title of the page
 */
function useTitle(title: string) {
    const titleElement = document.querySelector('title');
    if (titleElement) titleElement.innerText = title;
    else throw new Error('Cannot use `useTitle([string])` when no <title></title> element exists');
}

export { useTitle };
