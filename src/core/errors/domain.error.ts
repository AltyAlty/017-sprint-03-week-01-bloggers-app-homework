/*Класс "DomainError" на основе встроенного класса "Error", для ошибок, когда к сущности нельзя применить какую-то
операцию в BLL.

Касательно TS: "public readonly" делает так, что экземпляры класса будут иметь публичное свойство, доступное только для
чтения. В итоге экземпляры этого класса могут иметь до 3 свойства: "code", "source" (опциональный) и "message"
(унаследовано от класса "Error" через вызов "super(detail))").*/
export class DomainError extends Error {
  constructor(
    detail: string,
    public readonly code: string,
    public readonly source?: string
  ) {
    super(detail);
  }
}
