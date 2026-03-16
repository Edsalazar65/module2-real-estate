import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProperties } from '@/lib/storage'; // Ajusta esto según tu API/Storage real
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { CompareButton } from '@/components/ui/CompareButton';

export function ComparePage() {
  const [compareList, setCompareList] = useState<Property[]>([]);

  const loadComparedProperties = () => {
    const storedIds = JSON.parse(localStorage.getItem('compareList') || '[]');
    // Supongamos que tienes una función para obtener todas las propiedades
    const allProperties = getAllProperties(); 
    const selected = allProperties.filter(p => storedIds.includes(p.id));
    setCompareList(selected);
  };

  useEffect(() => {
    loadComparedProperties();
    // Escuchar cambios si removemos desde esta misma página
    window.addEventListener('compareUpdated', loadComparedProperties);
    return () => window.removeEventListener('compareUpdated', loadComparedProperties);
  }, []);

  // Calcular mejores valores para resaltar
  const lowestPrice = Math.min(...compareList.map(p => p.price));
  const highestArea = Math.max(...compareList.map(p => p.area));

  // Empty State
  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Comparación de Propiedades</h1>
        <p className="text-muted-foreground mb-6">No has seleccionado ninguna propiedad para comparar.</p>
        <Button asChild>
          <Link to="/">Volver a la lista</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Comparando {compareList.length} propiedades</h1>
        <Button asChild variant="outline">
          <Link to="/">Volver al listado</Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 font-medium text-muted-foreground">Característica</th>
              {compareList.map(prop => (
                <th key={prop.id} className="p-4 font-bold text-lg">{prop.title}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {/* Precio */}
            <tr>
              <td className="p-4 font-medium">Precio</td>
              {compareList.map(prop => (
                <td key={prop.id} className={`p-4 ${prop.price === lowestPrice ? 'bg-green-100 text-green-800 font-bold dark:bg-green-900/30' : ''}`}>
                  ${prop.price.toLocaleString()}
                </td>
              ))}
            </tr>
            {/* Habitaciones */}
            <tr>
              <td className="p-4 font-medium">Habitaciones</td>
              {compareList.map(prop => (
                <td key={prop.id} className="p-4">{prop.bedrooms}</td>
              ))}
            </tr>
            {/* Baños */}
            <tr>
              <td className="p-4 font-medium">Baños</td>
              {compareList.map(prop => (
                <td key={prop.id} className="p-4">{prop.bathrooms}</td>
              ))}
            </tr>
            {/* Área */}
            <tr>
              <td className="p-4 font-medium">Área (m²)</td>
              {compareList.map(prop => (
                <td key={prop.id} className={`p-4 ${prop.area === highestArea ? 'bg-blue-100 text-blue-800 font-bold dark:bg-blue-900/30' : ''}`}>
                  {prop.area} m²
                </td>
              ))}
            </tr>
            {/* Precio por m2 */}
            <tr>
              <td className="p-4 font-medium">Precio / m²</td>
              {compareList.map(prop => (
                <td key={prop.id} className="p-4">
                  ${Math.round(prop.price / prop.area).toLocaleString()}
                </td>
              ))}
            </tr>
            {/* Acciones */}
            <tr>
              <td className="p-4"></td>
              {compareList.map(prop => (
                <td key={prop.id} className="p-4">
                  <CompareButton propertyId={prop.id} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}