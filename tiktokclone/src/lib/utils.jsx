export function formatTimestamp(timestamp) {
    const now = new Date();
    const timeDiffInSeconds = Math.floor((now - timestamp.toDate()) / 1000);
  
    if (timeDiffInSeconds < 60) {
      return `${timeDiffInSeconds} ${timeDiffInSeconds === 1 ? 'second' : 'seconds'} ago`;
    } else if (timeDiffInSeconds < 3600) {
      const minutes = Math.floor(timeDiffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (timeDiffInSeconds < 86400) {
      const hours = Math.floor(timeDiffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(timeDiffInSeconds / 86400);
  
      // Using Intl.DateTimeFormat for more human-readable date format
      const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
  
      const dateStr = formatter.format(timestamp.toDate());
      return `${days} ${days === 1 ? 'day' : 'days'} ago, on ${dateStr}`;
    }
  }
  