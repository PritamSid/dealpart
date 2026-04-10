import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerService);
  });

  it('should support add, update, and delete operations through the mock API', async () => {
    const beforeList = await firstValueFrom(service.getCustomers());

    const added = await firstValueFrom(
      service.addCustomer({
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+1 (555) 000-0000',
        status: 'Active',
      })
    );

    expect(added.customerId).toBeTruthy();

    const fetched = await firstValueFrom(service.getCustomerById(added.customerId));
    expect(fetched?.name).toBe('Test Customer');

    await firstValueFrom(
      service.updateCustomer({
        ...added,
        name: 'Updated Customer',
        totalSpend: '$999',
      })
    );

    const updated = await firstValueFrom(service.getCustomerById(added.customerId));
    expect(updated?.name).toBe('Updated Customer');

    await firstValueFrom(service.deleteCustomer(added.customerId));

    const afterList = await firstValueFrom(service.getCustomers());
    expect(afterList.length).toBe(beforeList.length);
  });
});
