import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { IconPicker } from './icon-picker';

describe('IconPicker', () => {
  it('filters the manifest and keeps the DOM virtualized', async () => {
    const icons = Array.from({ length: 1000 }, (_, index) => `Spell_Test_${index}.PNG`);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ version: 1, count: icons.length, icons }) }));
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 460, height: 440, top: 0, right: 460, bottom: 440, left: 0, x: 0, y: 0, toJSON: () => ({}),
    });
    const onChange = vi.fn();
    function Wrapper() {
      const [search, setSearch] = useState('');
      return <IconPicker value="" onChange={onChange} search={search} onSearchChange={setSearch} />;
    }
    render(<Wrapper />);
    await waitFor(() => expect(screen.getByText(/1.*000 icônes/)).toBeInTheDocument());
    expect(document.querySelectorAll('.icon-choice').length).toBeLessThan(100);
    fireEvent.change(screen.getByPlaceholderText('Rechercher une icône…'), { target: { value: '999' } });
    await waitFor(() => expect(screen.getByText('1 icône')).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Choisir Spell_Test_999.PNG' }));
    expect(onChange).toHaveBeenCalledWith('Spell_Test_999.PNG');
  });
});
