import React, {
    useState,
    useRef,
    useEffect,
    KeyboardEventHandler,
    createRef,
} from 'react';
import Text from '../../atoms/Text';
import styles from './Select.module.scss';

export const KEY_CODES = {
    ENTER: 13,
    SPACE: 32,
    DOWN_ARROW: 40,
    ESC: 27,
    UP_ARROW: 38,
};

interface SelectOption {
    label: string;
    value: string;
}

interface RenderOptionProps {
    isSelected: boolean;
    option: SelectOption;
    getOptionRecommendedProps: (overrideProps?: Object) => Object;
}

interface SelectProps {
    onOptionSelected?: (option: SelectOption, optionIndex: number) => void;
    options?: SelectOption[];
    label?: string;
    renderOption?: (props: RenderOptionProps) => React.ReactElement;
}

const getNextOptionIndex = (
    currentIndex: number | null,
    options: Array<SelectOption>
) => {
    if (currentIndex === null) {
        return 0;
    }

    if (currentIndex === options.length - 1) {
        return 0;
    }

    return currentIndex + 1;
};

const getPreviousOptionIndex = (
    currentIndex: number | null,
    options: Array<SelectOption>
) => {
    if (currentIndex === null) {
        return 0;
    }

    if (currentIndex === 0) {
        return options.length - 1;
    }

    return currentIndex - 1;
};

const Select: React.FC<SelectProps> = ({
    options = [],
    label = 'Please select an option',
    onOptionSelected: handler,
    renderOption,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const labelRef = useRef<HTMLButtonElement>(null);
    const [overlayTop, setOverlayTop] = useState<number>(0);
    const [selectedIndex, setSelectedIndex] = useState<null | number>(null);
    const [highlightedIndex, setHighlightedIndex] = useState<null | number>(
        null
    );
    const [optionRefs, setOptionRefs] = useState<
        React.RefObject<HTMLLIElement>[]
    >([]);

    const onOptionSelected = (option: SelectOption, optionIndex: number) => {
        if (handler) {
            handler(option, optionIndex);
        }

        setSelectedIndex(optionIndex);
        setIsOpen(false);
    };

    const onLabelClick = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setOverlayTop((labelRef.current?.offsetHeight || 0) + 10);
    }, [labelRef.current?.offsetHeight]);

    let selectedOption = null;

    if (selectedIndex !== null) {
        selectedOption = options[selectedIndex];
    }

    const highlightOption = (optionIndex: number | null) => {
        setHighlightedIndex(optionIndex);
    };

    const onButtonKeyDown: KeyboardEventHandler = (event) => {
        event.preventDefault();

        if (
            [KEY_CODES.ENTER, KEY_CODES.SPACE, KEY_CODES.DOWN_ARROW].includes(
                event.keyCode
            )
        ) {
            setIsOpen(true);
            highlightOption(0);
        }
    };

    useEffect(() => {
        setOptionRefs(options.map((_) => createRef<HTMLLIElement>()));
    }, [options.length]);

    useEffect(() => {
        if (highlightedIndex !== null && isOpen) {
            const ref = optionRefs[highlightedIndex];
            console.log(highlightedIndex, ref);
            if (ref && ref.current) {
                ref.current.focus();
            }
        }
    }, [isOpen, highlightedIndex]);

    const onOptionKeyDown: KeyboardEventHandler = (event) => {
        if (event.keyCode === KEY_CODES.ESC) {
            setIsOpen(false);
        }

        if (event.keyCode === KEY_CODES.DOWN_ARROW) {
            highlightOption(getNextOptionIndex(highlightedIndex, options));
        }

        if (event.keyCode === KEY_CODES.UP_ARROW) {
            highlightOption(getPreviousOptionIndex(highlightedIndex, options));
        }

        if (event.keyCode === KEY_CODES.ENTER) {
            onOptionSelected(options[highlightedIndex!], highlightedIndex!);
        }
    };

    return (
        <div className={styles['select']}>
            <button
                data-testid='SelectButton'
                ref={labelRef}
                aria-controls='select-list'
                aria-haspopup={true}
                aria-expanded={isOpen ? true : undefined}
                className={styles['select-label']}
                onClick={() => onLabelClick()}
                onKeyDown={onButtonKeyDown}
            >
                <Text>
                    {selectedOption === null ? label : selectedOption.label}
                </Text>

                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className={`h-6 w-6' ${styles['select-caret']} ${
                        isOpen
                            ? styles['select-caret--open']
                            : styles['select-caret--close']
                    }`}
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    width='1rem'
                    height='1rem'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                    />
                </svg>
            </button>

            {isOpen ? (
                <ul
                    id='select-list'
                    style={{ top: overlayTop }}
                    className={styles['select-overlay']}
                >
                    {options.map((option, optionIndex) => {
                        const isSelected = selectedIndex === optionIndex;
                        const isHighlighted = highlightedIndex === optionIndex;
                        const ref = optionRefs[optionIndex];
                        const renderOptionProps = {
                            ref,
                            option,
                            isSelected,
                            getOptionRecommendedProps: (overrideProps = {}) => {
                                return {
                                    ref,
                                    role: 'menuitemradio',
                                    'aria-label': option.label,
                                    'aria-checked': isSelected
                                        ? true
                                        : undefined,
                                    onKeyDown: onOptionKeyDown,
                                    tabIndex: isHighlighted ? -1 : 0,
                                    onMouseEnter: () =>
                                        highlightOption(optionIndex),
                                    onMouseLeave: () => highlightOption(null),
                                    className: `${styles['select-option']} ${
                                        isSelected
                                            ? styles['select-option--selected']
                                            : ''
                                    } ${
                                        isHighlighted
                                            ? styles[
                                                  'select-option--highlighted'
                                              ]
                                            : ''
                                    }`,
                                    key: option.value,
                                    onClick: () =>
                                        onOptionSelected(option, optionIndex),
                                    ...overrideProps,
                                };
                            },
                        };

                        if (renderOption) {
                            return renderOption(renderOptionProps);
                        }
                        return (
                            <li
                                {...renderOptionProps.getOptionRecommendedProps()}
                            >
                                <Text>{option.label}</Text>

                                {isSelected ? (
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='h-6 w-6'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                        height='1rem'
                                        width='1rem'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M5 13l4 4L19 7'
                                        />
                                    </svg>
                                ) : null}
                            </li>
                        );
                    })}
                </ul>
            ) : null}
        </div>
    );
};

export default Select;
