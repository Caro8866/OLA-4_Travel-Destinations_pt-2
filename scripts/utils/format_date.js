export function formatDate(inputDate) {
    const date = new Date(inputDate);
  
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
  
    const formatter = new Intl.DateTimeFormat("en-US", options);
    const parts = formatter.formatToParts(date);
    const formattedDate = `${parts[2].value} ${parts[0].value}, ${parts[4].value}`;
    return formattedDate;
  }