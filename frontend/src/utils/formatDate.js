export function formatDate(dateString) {
    if (!dateString) return "";
  
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${month}/${day}/${year}`;
  }