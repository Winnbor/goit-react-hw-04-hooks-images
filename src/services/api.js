function fetchQuery(query, page = 1) {
  return fetch(
    `https://pixabay.com/api/?key=22119971-476802e1015186c1b911d3e90&per_page=16&page=${page}&q=${query}`,
  ).then(res => {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(
      new Error(`Ooh no! Something went wrong, try again later`),
    );
  });
}

export { fetchQuery };
