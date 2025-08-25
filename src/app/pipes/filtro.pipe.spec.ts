import { FiltroPipe } from './filtro.pipe';

describe('FiltroPipe', () => {
  const pipe = new FiltroPipe();

  it('debería filtrar correctamente', () => {
    const items = [{ nombre: 'Juan' }, { nombre: 'Ana' }];
    expect(pipe.transform(items, 'Juan', 'nombre').length).toBe(1);
    expect(pipe.transform(items, 'Ana', 'nombre')[0].nombre).toBe('Ana');
  });
});
