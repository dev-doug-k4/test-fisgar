import React, { useMemo, useState, useRef, useEffect } from 'react';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';
// redux
import { setAddress } from '../redux/slices/session'
import { useDispatch } from '../redux/store';
// @mui
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// Essa chave funcionará somente na porta 3000.
const GOOGLE_MAPS_API_KEY = 'AIzaSyAir7lcnEuN3slH5uOecTg5ngIqjj2tZpc';

function loadScript(src: string, position: HTMLElement | null, id: string) {
    if (!position) {
        return;
    }

    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('id', id);
    script.src = src;
    position.appendChild(script);
}

const autocompleteService = { current: null };

interface MainTextMatchedSubstrings {
    offset: number;
    length: number;
}
interface StructuredFormatting {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings: readonly MainTextMatchedSubstrings[];
}
interface PlaceType {
    description: string;
    place_id: string;
    structured_formatting: StructuredFormatting;
}

type Props = {
    fieldProps: {
        id: string;
        name: string;
        label: string;
        value: string;
        error?: string | undefined | boolean;
        helperText?: string | undefined | boolean;
    };
    onChange: VoidFunction;
}

export default function PlaceInput({ fieldProps, onChange }: Props) {
    const dispatch = useDispatch()

    const [value, setValue] = useState<PlaceType | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<readonly PlaceType[]>([]);
    const loaded = useRef(false);

    if (typeof window !== 'undefined' && !loaded.current) {
        if (!document.querySelector('#google-maps')) {
            loadScript(
                `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`,
                document.querySelector('head'),
                'google-maps',
            );
        }

        loaded.current = true;
    }

    const fetch = useMemo(
        () =>
            throttle(
                (
                    request: { input: string },
                    callback: (results?: readonly PlaceType[]) => void,
                ) => {
                    (autocompleteService.current as any).getPlacePredictions(
                        request,
                        callback,
                    );
                },
                200,
            ),
        [],
    );

    useEffect(() => {
        let active = true;

        if (!autocompleteService.current && (window as any).google) {
            autocompleteService.current = new (
                window as any
            ).google.maps.places.AutocompleteService();
        }
        if (!autocompleteService.current) {
            return undefined;
        }

        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch({ input: inputValue }, (results?: readonly PlaceType[]) => {
            if (active) {
                let newOptions: readonly PlaceType[] = [];

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    newOptions = [...newOptions, ...results];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    useEffect(() => {
        if (!!value?.place_id) {
            // @ts-ignore
            const geocoder = new google.maps.Geocoder();
            geocoder
                .geocode({ placeId: value.place_id })
                .then((response: any) => {
                    // console.log(response)
                    const description = response.results[0].formatted_address;
                    const lat = response.results[0].geometry.location.lat();
                    const lng = response.results[0].geometry.location.lng();

                    let street, district, city, state, zip_code;

                    for (let i = 0; i < response.results[0].address_components.length; i++) {
                        for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
                            switch (response.results[0].address_components[i].types[j]) {
                                case "route":
                                    street = response.results[0].address_components[i].long_name;
                                    break;
                                case "sublocality" || "sublocality_level_1":
                                    district = response.results[0].address_components[i].long_name;
                                    break;
                                case "administrative_area_level_2":
                                    city = response.results[0].address_components[i].long_name;
                                    break;
                                case "administrative_area_level_1":
                                    state = response.results[0].address_components[i].long_name;
                                    break;
                                case "postal_code":
                                    zip_code = response.results[0].address_components[i].long_name;
                                    break;
                            }
                        }
                    }
                    dispatch(setAddress({ street, district, city, state, zip_code, lat, lng, description }))
                })
                .catch((e: any) => window.alert("Geocode Error. Certifique-se que está rodando na porta 3000: " + e));
        }
    }, [value])

    return (
        <Autocomplete
            id="google-map-demo"
            getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.description
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            onChange={(event: any, newValue: PlaceType | null) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                // @ts-ignore
                <TextField {...params} {...fieldProps} onChange={onChange} />
            )}
            renderOption={(props, option) => {
                const matches = option.structured_formatting.main_text_matched_substrings;
                const parts = parse(
                    option.structured_formatting.main_text,
                    matches.map((match: any) => [match.offset, match.offset + match.length]),
                );

                return (
                    <li {...props}>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Box
                                    component={LocationOnIcon}
                                    sx={{ color: 'text.secondary', mr: 2 }}
                                />
                            </Grid>
                            <Grid item xs>
                                {parts.map((part, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            fontWeight: part.highlight ? 700 : 400,
                                        }}
                                    >
                                        {part.text}
                                    </span>
                                ))}
                                <Typography variant="body2" color="text.secondary">
                                    {option.structured_formatting.secondary_text}
                                </Typography>
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
        />
    );
}
