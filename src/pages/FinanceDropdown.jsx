import React, { useState, useEffect, useRef } from 'react';
import { Menu } from '@headlessui/react';
import "@maxhub/max-ui/dist/styles.css";
import { Button, Input } from "@maxhub/max-ui";
import "../App.css";

const CustomMenu = ({ value, onValueChange, children, onClose }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const filteredChildren = React.Children.toArray(children).filter(
    (child) =>
      !searchValue || child.props.children.toLowerCase().includes(searchValue.toLowerCase()),
  );

  return (
    <div
      style={{
        maxWidth: '400px',
        maxHeight: '300px',
        display: 'block',
        backgroundColor: '#2c2d30',
        border: '1px solid #4a5568',
        borderRadius: '6px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        color: 'white',
      }}
    >
      <div style={{ position: 'relative' }}>
        <Input
          autoFocus
          placeholder="Поиск"
          onChange={handleSearchChange}
          value={searchValue}
          mode="secondary"
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            paddingRight: '40px',
            margin: '10px 12px',
            width: 'auto'
          }}
        />
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: '#a0aec0',
            cursor: 'pointer',
            fontSize: '16px',
            width: '24px',
            height: '24px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#718096';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#a0aec0';
          }}
        >
          ×
        </button>
      </div>
      <div 
        style={{
          maxHeight: 'calc(300px - 100px)',
          overflowY: 'auto',
          margin: 0,
          padding: 0
        }}
      >
        <ul className="list-unstyled" style={{ margin: 0, padding: 0 }}>
          {filteredChildren}
        </ul>
      </div>
    </div>
  );
};

const MenuItem = ({ children, isActive, onClick }) => (
  <li style={{ margin: 0, padding: 0 }}>
    <button
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '10px 16px',
        border: 'none',
        backgroundColor: isActive ? '#4299e1' : 'transparent',
        color: isActive ? 'white' : '#e2e8f0',
        cursor: 'pointer',
        fontSize: '14px',
        lineHeight: '1.4',
        borderBottom: '1px solid #4a5568',
        transition: 'background-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.target.style.backgroundColor = '#4a5568';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.target.style.backgroundColor = 'transparent';
        }
      }}
    >
      {children}
    </button>
  </li>
);

const CustomDropdown = ({ onChange, name, initialSelectedOption = '' }) => {
  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);
  const [selectedEventKey, setSelectedEventKey] = useState('');

  // Set initial selected option if provided
  useEffect(() => {
    if (initialSelectedOption) {
      setSelectedOption(initialSelectedOption);
      // Find the corresponding event key for the initial option
      const items = [
        { key: "1.1", text: "1.1 Беременность (сроком от 20 недель)" },
        { key: "1.2", text: "1.2 Рождение ребёнка (детей)" },
        { key: "1.3", text: "1.3 Чрезвычайные происшествия (стихийные бедствия, техногенные аварии, пожар, наводнение и т.п.)" },
        { key: "1.4", text: "1.4 Смерть близкого родственника (родителей, супруга, ребенка, родных братьев и сестер, опекуна, попечителя)" },
        { key: "1.5", text: "1.5 Признание погибшим или без вести пропавшим родственника - участника СВО (мать, отец, супруг, супруга)" },
        { key: "2.1", text: "2.1 Заключение брака" },
        { key: "2.2", text: "2.2 Получение увечья (ранения, травмы, контузии), в результате которого наступила инвалидность родственника (мать, отец, супруг, супруга) - участника СВО" },
        { key: "2.3", text: "2.3 Получение увечья (ранения, травмы, контузии), в результате которого наступила инвалидность обучающегося - участника СВО" },
        { key: "2.4", text: "2.4 Вынужденный выезд с территории Курской, Белгородской, Брянской областей в связи с чрезвычайной ситуацией" },
        { key: "3.1", text: "3.1 Санаторно-курортное лечение" },
        { key: "3.2", text: "3.2 Компенсация затрат на проезд к постоянному месту жительства и обратно к месту учебы" },
        { key: "4.1", text: "4.1 Компенсация платы за пребывание ребенка в дошкольном образовательном учреждении" },
        { key: "4.2", text: "4.2 Наличие ребенка (детей) до 14 лет" },
        { key: "4.3", text: "4.3 Наличие родственников (мать, отец, супруг, супруга), являющихся участниками специальной военной операции" },
        { key: "4.4", text: "4.4 Обучающийся - участник специальной военной операции" },
        { key: "4.5", text: "4.5 Тяжелое материальное положение обучающегося" },
        { key: "4.6", text: "4.6 Заболевание обучающегося, требующее дорогостоящего обследования и лечения" },
        { key: "4.7", text: "4.7 Студент из неполной семьи, обучающийся по программе бакалавриата или специалитета" },
        { key: "4.8", text: "4.8 Студент из многодетной семьи, обучающийся по программе бакалавриата или специалитета" },
        { key: "4.9", text: "4.9 Студент, имеющий регистрацию в отдаленном районе г. Новосибирска и не проживающий в общежитии" },
        { key: "4.10", text: "4.10 Студент, получающий государственную социальную помощь" },
        { key: "5.1", text: "5.1 Студент-инвалид (ребенок-инвалид, инвалид с детства, инвалид I, II, III групп)" },
        { key: "5.2", text: "5.2 Студент из числа детей-сирот и детей, оставшихся без попечения родителей" },
        { key: "5.3", text: "5.3 Студент, у которого оба родителя (единственный родитель) являются пенсионерами по старости" },
        { key: "5.4", text: "5.4 Студент, у которого оба родителя (единственный родитель) являются инвалидами I или II группы" },
      ];
      
      const matchingItem = items.find(item => item.text === initialSelectedOption);
      if (matchingItem) {
        setSelectedEventKey(matchingItem.key);
      }
    }
  }, [initialSelectedOption]);

  const handleSelect = (eventKey, text) => {
    setSelectedOption(text);
    setSelectedEventKey(eventKey);
    
    if (onChange) {
      const syntheticEvent = {
        target: {
          name: name,
          value: text
        }
      };
      onChange(syntheticEvent);
    }
  };

  const isItemActive = (eventKey) => {
    return eventKey === selectedEventKey;
  };

  return (
    <Menu as="div" className="relative">
      {({ open, close }) => (
        <>
          <Menu.Button as={React.Fragment}>
            <Button
              appearance="neutral"
              mode="secondary"
              style={{ 
                textDecoration: 'none',
                width: 325
              }}
              className='financeInput'
              stretched
              size="large"
              name={name}
            >
              {selectedOption || 'Choose option'}
            </Button>
          </Menu.Button>

          {open && (
            <Menu.Items static className="absolute z-10 mt-1 w-full">
              <CustomMenu onClose={close}>
                <MenuItem 
                  onClick={() => {
                    handleSelect("1.1", "1.1 Беременность (сроком от 20 недель)");
                    close();
                  }}
                  isActive={isItemActive("1.1")}
                >
                  1.1 Беременность (сроком от 20 недель)
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("1.2", "1.2 Рождение ребёнка (детей)");
                    close();
                  }}
                  isActive={isItemActive("1.2")}
                >
                  1.2 Рождение ребёнка (детей)
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("1.3", "1.3 Чрезвычайные происшествия (стихийные бедствия, техногенные аварии, пожар, наводнение и т.п.)");
                    close();
                  }}
                  isActive={isItemActive("1.3")}
                >
                  1.3 Чрезвычайные происшествия (стихийные бедствия, техногенные аварии, пожар, наводнение и т.п.)
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("1.4", "1.4 Смерть близкого родственника (родителей, супруга, ребенка, родных братьев и сестер, опекуна, попечителя)");
                    close();
                  }}
                  isActive={isItemActive("1.4")}
                >
                  1.4 Смерть близкого родственника (родителей, супруга, ребенка, родных братьев и сестер, опекуна, попечителя)
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("1.5", "1.5 Признание погибшим или без вести пропавшим родственника - участника СВО (мать, отец, супруг, супруга)");
                    close();
                  }}
                  isActive={isItemActive("1.5")}
                >
                  1.5 Признание погибшим или без вести пропавшим родственника - участника СВО (мать, отец, супруг, супруга)
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("2.1", "2.1 Заключение брака");
                    close();
                  }}
                  isActive={isItemActive("2.1")}
                >
                  2.1 Заключение брака
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("2.2", "2.2 Получение увечья (ранения, травмы, контузии), в результате которого наступила инвалидность родственника (мать, отец, супруг, супруга) - участника СВО");
                    close();
                  }}
                  isActive={isItemActive("2.2")}
                >
                  2.2 Получение увечья (ранения, травмы, контузии), в результате которого наступила инвалидность родственника (мать, отец, супруг, супруга) - участника СВО
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("2.3", "2.3 Получение увечья (ранения, травмы, контузии), в результате которого наступила инвалидность обучающегося - участника СВО");
                    close();
                  }}
                  isActive={isItemActive("2.3")}
                >
                  2.3 Получение увечья (ранения, травмы, контузии), в результате которого наступила инвалидность обучающегося - участника СВО
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("2.4", "2.4 Вынужденный выезд с территории Курской, Белгородской, Брянской областей в связи с чрезвычайной ситуацией");
                    close();
                  }}
                  isActive={isItemActive("2.4")}
                >
                  2.4 Вынужденный выезд с территории Курской, Белгородской, Брянской областей в связи с чрезвычайной ситуацией
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("3.1", "3.1 Санаторно-курортное лечение");
                    close();
                  }}
                  isActive={isItemActive("3.1")}
                >
                  3.1 Санаторно-курортное лечение
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("3.2", "3.2 Компенсация затрат на проезд к постоянному месту жительства и обратно к месту учебы");
                    close();
                  }}
                  isActive={isItemActive("3.2")}
                >
                  3.2 Компенсация затрат на проезд к постоянному месту жительства и обратно к месту учебы
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("4.1", "4.1 Компенсация платы за пребывание ребенка в дошкольном образовательном учреждении");
                    close();
                  }}
                  isActive={isItemActive("4.1")}
                >
                  4.1 Компенсация платы за пребывание ребенка в дошкольном образовательном учреждении
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("4.2", "4.2 Наличие ребенка (детей) до 14 лет");
                    close();
                  }}
                  isActive={isItemActive("4.2")}
                >
                  4.2 Наличие ребенка (детей) до 14 лет
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("4.3", "4.3 Наличие родственников (мать, отец, супруг, супруга), являющихся участниками специальной военной операции");
                    close();
                  }}
                  isActive={isItemActive("4.3")}
                >
                  4.3 Наличие родственников (мать, отец, супруг, супруга), являющихся участниками специальной военной операции
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("4.4", "4.4 Обучающийся - участник специальной военной операции");
                    close();
                  }}
                  isActive={isItemActive("4.4")}
                >
                  4.4 Обучающийся - участник специальной военной операции
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("4.5", "4.5 Тяжелое материальное положение обучающегося");
                    close();
                  }}
                  isActive={isItemActive("4.5")}
                >
                  4.5 Тяжелое материальное положение обучающегося
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("4.6", "4.6 Заболевание обучающегося, требующее дорогостоящего обследования и лечения");
                    close();
                  }}
                  isActive={isItemActive("4.6")}
                >
                  4.6 Заболевание обучающегося, требующее дорогостоящего обследования и лечения
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("4.7", "4.7 Студент из неполной семьи, обучающийся по программе бакалавриата или специалитета");
                    close();
                  }}
                  isActive={isItemActive("4.7")}
                >
                  4.7 Студент из неполной семьи, обучающийся по программе бакалавриата или специалитета
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("4.8", "4.8 Студент из многодетной семьи, обучающийся по программе бакалавриата или специалитета");
                    close();
                  }}
                  isActive={isItemActive("4.8")}
                >
                  4.8 Студент из многодетной семьи, обучающийся по программе бакалавриата или специалитета
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("4.9", "4.9 Студент, имеющий регистрацию в отдаленном районе г. Новосибирска и не проживающий в общежитии");
                    close();
                  }}
                  isActive={isItemActive("4.9")}
                >
                  4.9 Студент, имеющий регистрацию в отдаленном районе г. Новосибирска и не проживающий в общежитии
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("4.10", "4.10 Студент, получающий государственную социальную помощь");
                    close();
                  }}
                  isActive={isItemActive("4.10")}
                >
                  4.10 Студент, получающий государственную социальную помощь
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("5.1", "5.1 Студент-инвалид (ребенок-инвалид, инвалид с детства, инвалид I, II, III групп)");
                    close();
                  }}
                  isActive={isItemActive("5.1")}
                >
                  5.1 Студент-инвалид (ребенок-инвалид, инвалид с детства, инвалид I, II, III групп)
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("5.2", "5.2 Студент из числа детей-сирот и детей, оставшихся без попечения родителей");
                    close();
                  }}
                  isActive={isItemActive("5.2")}
                >
                  5.2 Студент из числа детей-сирот и детей, оставшихся без попечения родителей
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("5.3", "5.3 Студент, у которого оба родителя (единственный родитель) являются пенсионерами по старости");
                    close();
                  }}
                  isActive={isItemActive("5.3")}
                >
                  5.3 Студент, у которого оба родителя (единственный родитель) являются пенсионерами по старости
                </MenuItem>
                <MenuItem 
                  onClick={() => {
                    handleSelect("5.4", "5.4 Студент, у которого оба родителя (единственный родитель) являются инвалидами I или II группы");
                    close();
                  }}
                  isActive={isItemActive("5.4")}
                >
                  5.4 Студент, у которого оба родителя (единственный родитель) являются инвалидами I или II группы
                </MenuItem>
              </CustomMenu>
            </Menu.Items>
          )}
        </>
      )}
    </Menu>
  );
};

export default CustomDropdown;