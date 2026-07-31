import { Dispatch, SetStateAction } from "react";
import { Modal, View, Text, Pressable, FlatList } from "react-native";

interface Props{
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    items: SelectorItem[]
    onSelect: (picked: SelectorItem) => void;
}

export interface SelectorItem{
    displayText:string,
    value:number;
}
export interface SelectorConfig {
    items:SelectorItem[]
    onSelect: (picked: SelectorItem) => void;
}

const ValueSelectorModal = ({ visible, setVisible, items, onSelect }: Props) => {
    const handleClose = () => setVisible(false);
    const handleSelect = (item:SelectorItem) => {
        onSelect(item); // Send the selected item out of the modal
        handleClose(); // Close modal
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={handleClose}
        >
            {/* Modal Overlay / Backdrop */}
            <View className="flex-1 justify-center bg-black/50 p-4">
                {/* Modal Container */}
                <View
                    className={`rounded-xl overflow-hidden bg-white dark:bg-gray-800`}
                >
                    {/* Modal.Header */}
                    <View
                        className={`flex-row justify-between items-center px-5 py-4 border-b border-gray-200 dark:border-gray-700`}
                    >
                        <Text className="text-2xl font-bold text-black dark:text-white">
                            Pick a value
                        </Text>

                        {/* Close Button Equivalent */}
                        <Pressable
                            onPress={handleClose}
                            className="h-11 w-11 items-center justify-center rounded-full active:bg-gray-100 dark:active:bg-gray-700"
                            aria-label="Close value picker"
                        >
                            <Text className="text-gray-500 text-2xl font-bold">✕</Text>
                        </Pressable>
                    </View>

                    {/* Modal.Body - Changed ScrollView to View */}
                    <View className="p-4 h-[85vh]">
                        {/* Body */}
                        <View className="flex-1">
                            {/* Put flatlist here */}
                            <FlatList 
                            data={items}
                            renderItem={({item}) => (
                                <View className="mt-5 items-center">
                                    <Pressable className="bg-gray-200 w-60 py-3 rounded-2xl"
                                    onPress={() => handleSelect(item)}>
                                        <Text className="text-3xl font-semibold text-center"> {item.displayText} </Text>
                                    </Pressable>
                                </View>
                            )}
                            
                            />
                        </View>
                    </View>

                </View>
            </View>
        </Modal>

    );
}

export default ValueSelectorModal