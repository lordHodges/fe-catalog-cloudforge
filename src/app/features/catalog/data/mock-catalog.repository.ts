import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CatalogRepository } from '../domain/catalog.repository';
import { Product } from '../domain/product.model';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-test-01',
    name: 'Producto de Prueba Cloudforge',
    title: 'Producto de Prueba Cloudforge',
    description: 'Instancia cloud de prueba de alto rendimiento para entornos Cloudforge Marketplace.',
    price: 15000,
    category: 'Infrastructure',
    imageUrl: 'assets/images/prod-test-01.jpg',
    stock: 50
  },
  {
    id: 'prod-test-02',
    name: 'Kubernetes Enterprise Cluster',
    title: 'Kubernetes Enterprise Cluster',
    description: 'Cluster administrado k8s con autoscaling de nodos y monitoreo Prometheus integrado.',
    price: 45000,
    category: 'Infrastructure',
    imageUrl: 'assets/images/prod-test-02.jpg',
    stock: 20
  },
  {
    id: 'prod-test-03',
    name: 'Cloudforge DB Postgres Managed',
    title: 'Cloudforge DB Postgres Managed',
    description: 'Base de datos PostgreSQL altamente disponible con failover automático y backups continuos.',
    price: 25000,
    category: 'Databases',
    imageUrl: 'assets/images/prod-test-03.jpg',
    stock: 15
  },
  {
    id: 'prod-test-04',
    name: 'Serverless Event Mesh',
    title: 'Serverless Event Mesh',
    description: 'Bus de eventos distribuido de ultra baja latencia para arquitecturas reactivas.',
    price: 12000,
    category: 'Messaging',
    imageUrl: 'assets/images/prod-test-04.jpg',
    stock: 100
  },
  {
    id: 'prod-test-05',
    name: 'AI Vector Engine GPU',
    title: 'AI Vector Engine GPU',
    description: 'Acelerador de búsqueda vectorial con GPUs NVIDIA H100 para LLMs e IA generativa.',
    price: 85000,
    category: 'Compute',
    imageUrl: 'assets/images/prod-test-05.jpg',
    stock: 5
  },
  {
    id: 'prod-test-06',
    name: 'Cloud Security Guard',
    title: 'Cloud Security Guard',
    description: 'Servicio de auditoría de seguridad en tiempo real y prevención de amenazas.',
    price: 18000,
    category: 'Security',
    imageUrl: 'assets/images/prod-test-06.jpg',
    stock: 0
  }
];

@Injectable({
  providedIn: 'root'
})
export class MockCatalogRepository extends CatalogRepository {
  getProducts(): Observable<Product[]> {
    return of([...MOCK_PRODUCTS]);
  }

  getProductById(id: string): Observable<Product | undefined> {
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    return of(product ? { ...product } : undefined);
  }

  getCategories(): Observable<string[]> {
    const categories = Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)));
    return of(['Todas', ...categories]);
  }
}
