import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import logger from '../lib/logger';
import { OrderNotFoundError, PaymentError, ValidationError } from '../domain/errors';
import { OrderService } from '../services/OrderService';

@injectable()
export class OrderController {
  constructor(@inject(OrderService) private orderService: OrderService) {}

  processOrder = async (req: Request, res: Response) => {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body;
      const result = await this.orderService.placeOrder(customer, items, paymentMethod, paymentDetails);
      return res.json({ message: 'Pedido processado com sucesso', ...result });
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof PaymentError) {
        return res.status(400).json({ error: error.message });
      }
      logger.error(`Erro ao processar pedido: ${error.message}`);
      return res.status(500).json({ error: 'Erro interno' });
    }
  };

  getOrderById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    try {
      const order = await this.orderService.getOrderById(id);
      return res.status(200).json(order);
    } catch (error: any) {
      if (error instanceof OrderNotFoundError) {
        return res.status(404).json({ error: error.message });
      }
      logger.error(`Erro ao buscar pedido: ${error.message}`);
      return res.status(500).json({ error: 'Erro interno' });
    }
  };
}
