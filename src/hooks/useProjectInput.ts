export const useProjectInput = (items: any, setItems: any) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setItems({ ...items, [name]: value });
  };

  const handleSwitchChange = (name: string) => {
    const value = items[name] ? false : true;
    setItems({ ...items, [name]: value });
  };

  const handleNumberChange = (e: any, name: string) => {
    const value = e;
    setItems({ ...items, [name]: value });
  };

  const handleCheckedChange = (e: any, name: string) => {
    if (e.target.checked) {
      setItems({
        ...items,
        [name]: [...(items[name] || ""), e.target.value],
      });
    } else {
      setItems({
        ...items,
        [name]: [
          ...items[name]?.filter((size: string) => size !== e.target.value),
        ],
      });
    }
  };

  const handleRadioChange = (e: string, name: string) => {
    const value = e;
    setItems({ ...items, [name]: value });
  };

  return {
    handleInputChange,
    handleSwitchChange,
    handleNumberChange,
    handleCheckedChange,
    handleRadioChange,
  };
};
