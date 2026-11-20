import { injectable } from 'inversify';
import { Order, OrderLine } from '../domain/Order';
import { IOrderRepository } from './IOrderRepository';

@injectable()
export class InMemoryOrderRepository implements IOrderRepository {
  private orders: Order[] = [];

  async create(customer: string, items: OrderLine[], total: number): Promise<Order> {
    const order = { id: this.orders.length + 1, customer, items, total, status: 'confirmed' };
    this.orders.push(order);
    return order;
  }

  async findById(id: number): Promise<Order | null> {
    return this.orders.find((order) => order.id === id) ?? null;
  }
}
