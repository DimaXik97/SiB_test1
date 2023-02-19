function queryDecorator(fn, count, ms) {
  const callFunction = (callback, count) => {
    if (count === 0) {
      // В задаче не сказано, что дожно произойти после того как закончится количество попыток
      // Поэтому было добавлено проброс ошибки(хоть и в функции fetchObject это никак не обрабатывается )
      throw new Error("Сервер недоступен");
    } else {
      return callback().catch(() =>
        setTimeout(() => callFunction(callback, count - 1), ms)
      );
    }
  };
  return function (...args) {
    return callFunction(() => fn.call(this, args), count);
  };
}

const fetchObject = {
  url: "https://jsonplaceholder.typicode.com/todos",
  getTodoById(id) {
    return fetch(`${this.url}/${id}`)
      .then((response) => response.json())
      .then((json) => console.log(json));
  },
};

fetchObject.getTodoById = queryDecorator(fetchObject.getTodoById, 5, 500);
fetchObject.getTodoById(1);
