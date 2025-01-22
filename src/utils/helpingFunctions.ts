export const getInitialLetter = (fullName?: string) => {
    if (!fullName) return "";
    const nameParts = fullName.split(" ");
    return nameParts.length === 1
      ? fullName.slice(0, 2).toUpperCase()
      : nameParts
          .map((name: string) => name[0])
          .join("")
          .toUpperCase();
};

export const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};