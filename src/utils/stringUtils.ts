const nonCapitalizedWords = [
    'a',
    'an',
    'and',
    'as',
    'at',
    'but',
    'by',
    'for',
    'in',
    'nor',
    'of',
    'on',
    'or',
    'so',
    'the',
    'to',
    'up',
    'yet',
];

export const capitalizeTitle = (title: string): string => {
    return title
        .split(' ')
        .map((word, index) => {
            if (
                index === 0 ||
                !nonCapitalizedWords.includes(word.toLowerCase())
            ) {
                return (
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
            }
            return word.toLowerCase();
        })
        .join(' ');
};
