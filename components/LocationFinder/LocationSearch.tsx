import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { LatLng, Suggestion } from '@/types/location-types';
import { useCombobox, type UseComboboxStateChange } from 'downshift';
import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import axios from 'redaxios';

type Props = {
  setUserLocation: Dispatch<SetStateAction<LatLng | null>>;
  mapReset: () => void;
};
export default function LocationSearch({ setUserLocation, mapReset }: Props) {
  const [term, setTerm] = useState('');
  const debouncedTerm = useDebouncedValue(term, 600);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  function handleSelection(selection: UseComboboxStateChange<Suggestion>) {
    const selectedItem = selection.selectedItem;

    if (!selectedItem) {
      return;
    }

    setUserLocation({
      lat: Number(selectedItem.latitude),
      lng: Number(selectedItem.longitude),
    });
  }

  const {
    getInputProps,
    getLabelProps,
    getMenuProps,
    getItemProps,
    isOpen,
    highlightedIndex,
    reset,
  } = useCombobox({
    items: suggestions, // Suchvorschläge
    // Wird bei jeder Texteingabe aufgerufen:
    onInputValueChange: (inputData) => setTerm(inputData.inputValue),
    itemToString, // Wandelt ausgewähltes Objekt in einen String für das input-Element um
    // Wird aufgerufen, wenn das ausgewählte Objekt sich ändert:
    onSelectedItemChange: handleSelection,
  });

  function clearSearch() {
    setTerm('');
    reset();
    mapReset();
  }

  useLocationSearch(debouncedTerm, setSuggestions);

  return (
    <div className="combobox">
      <label {...getLabelProps()}>Ort oder Postleitzahl</label>
      <div className="input-delete-wrapper">
        <input className="combobox__input" {...getInputProps()} />
        <button onClick={clearSearch} aria-label="Eingabe löschen">
          &times;
        </button>
      </div>
      <ul className="combobox__list" {...getMenuProps()}>
        {isOpen &&
          suggestions.map((suggestion, index) => (
            <li
              key={suggestion.place + suggestion.zipcode + suggestion.latitude}
              {...getItemProps({ item: suggestion, index })}
              className={`combobox__item ${
                index === highlightedIndex ? 'combobox__item--highlighted' : ''
              }`}
            >
              {suggestion.zipcode} {suggestion.place}
            </li>
          ))}
      </ul>
    </div>
  );
}

function itemToString(item: Suggestion | null) {
  if (!item) {
    return '';
  }

  return `${item.zipcode} ${item.place}`;
}

/* 1.Nutzt den useDebouncedValue-Hook,
 um den Wert von term verzögert in die Variable debouncedTerm zu speichern. */

/* 2. useEffect, redaxios und debouncedTerm nutzen, um Schnittstelle
  anzufragen und das Ergebnis in den State suggestions zu speichern. Prüft,
  ob mindestens zwei Zeichen eingegeben wurden. */
function useLocationSearch(
  debouncedTerm: string,
  setSuggestions: Dispatch<SetStateAction<Suggestion[]>>
) {
  useEffect(() => {
    let ignore = false;
    if (debouncedTerm.length < 2) {
      setSuggestions([]);
      ignore = true;
      return;
    }

    async function fetchSuggestions() {
      try {
        const { data } = await axios<Suggestion[]>('/api/locations', {
          params: {
            search: debouncedTerm,
          },
        });

        if (ignore) {
          return;
        }
        setSuggestions(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchSuggestions();

    return () => {
      ignore = true;
    };
  }, [debouncedTerm, setSuggestions]);
}
