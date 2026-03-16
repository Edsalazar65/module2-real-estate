import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CompareButtonProps {
  propertyId: string;
}

export function CompareButton({ propertyId }: CompareButtonProps) {
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    // Verificar si la propiedad ya está en comparación al montar el componente
    const compared = JSON.parse(localStorage.getItem('compareList') || '[]');
    setIsComparing(compared.includes(propertyId));
  }, [propertyId]);

  const toggleCompare = () => {
    const compared = JSON.parse(localStorage.getItem('compareList') || '[]');
    
    if (isComparing) {
      // Remover
      const newList = compared.filter((id: string) => id !== propertyId);
      localStorage.setItem('compareList', JSON.stringify(newList));
      setIsComparing(false);
      toast.success("Propiedad removida de la comparación");
      // Despachar evento para que ComparePage se actualice si estamos ahí
      window.dispatchEvent(new Event('compareUpdated')); 
    } else {
      // Agregar
      if (compared.length >= 3) {
        toast.error("Solo puedes comparar hasta 3 propiedades a la vez");
        return;
      }
      compared.push(propertyId);
      localStorage.setItem('compareList', JSON.stringify(compared));
      setIsComparing(true);
      toast.success("Propiedad agregada a la comparación");
    }
  };

  return (
    <Button 
      variant={isComparing ? "secondary" : "outline"} 
      size="sm" 
      onClick={toggleCompare}
    >
      {isComparing ? 'Quitar de comparación' : 'Añadir a comparar'}
    </Button>
  );
}