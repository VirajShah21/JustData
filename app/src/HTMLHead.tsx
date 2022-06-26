/**
 * Assigns a title to the HTML `<title>` element. If the HTML page does not include a
 * `<title>` element, then an error will be thrown.
 *
 * @param title - The title of the page
 */
function useTitle(title: string) {
    const titleElement = document.querySelector('title');
    if (titleElement) {
        titleElement.innerText = title;
    } else {
        throw new Error('Cannot use `useTitle([string])` when no <title></title> element exists');
    }
}

export { useTitle };
