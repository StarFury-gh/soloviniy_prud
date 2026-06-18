import { useState } from "react";
import { Button } from "../../../common";
import styles from "./RegisteredPlantCard.module.css";

interface RegisteredPlantCardProps {
  name: string;
  latinName: string;
  classId: number;
  editable: boolean;
  onRename?: (newName: string) => void;
}

function RegisteredPlantCard(props: RegisteredPlantCardProps) {
  const { name, latinName, classId, editable, onRename } = props;

  const [currentName, setCurrentName] = useState<string>(name);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>(name);
  const [isRenaming, setIsRenaming] = useState<boolean>(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRenaming(true);

    setNewName(e.target.value);
  };

  const handleBlur = () => {
    if (isRenaming) return;
    setNewName(name);
    setIsEditing(false);
  };

  const handleRename = () => {
    if (onRename) {
      setCurrentName(newName);
      onRename(newName);
    }
    setIsEditing(false);
    setTimeout(() => {
      setIsRenaming(true);
    }, 1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {editable ? (
          <input
            onChange={handleNameChange}
            onFocus={() => setIsEditing(true)}
            onBlur={handleBlur}
            className={styles.ruNameInput}
            value={isEditing ? newName : currentName}
          ></input>
        ) : (
          <p className={styles.ruName}>{currentName}</p>
        )}
        <p className={styles.latName}>{latinName}</p>
        <p className={styles.class_id}>ID класса: {classId}</p>
        {isEditing && <Button onClick={handleRename}>Обновить</Button>}
      </div>
    </div>
  );
}

export default RegisteredPlantCard;
