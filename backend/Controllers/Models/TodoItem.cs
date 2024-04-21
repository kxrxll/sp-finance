namespace TodoApi.Models;

public class TodoItem
{
    public long Id { get; set; }
    public string? Month { get; set; }
    public int Sum { get; set; }

    public virtual ICollection<Transaction>? Transactions { get; set; }
}

public class Transaction
{
    public long Id { get; set; }
    public long Date { get; set; }
    public int Sum { get; set; }
    public int TodoItemId { get; set; }
    public virtual TodoItem? TodoItem { get; set; }
}
