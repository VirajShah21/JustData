function useTitle(title: string) {
    const titleElement = document.querySelector('title');
    if (titleElement) titleElement.innerText = title;
    else throw new Error('Cannot use `useTitle([string])` when no <title></title> element exists');
}

export { useTitle };
