// Define your color palette
const colorPalette = ["#4CB592", "#4680FF", "#8451C5", "#FF6464"];

// Function to generate a hash for a string
const generateHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length - 1; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
};

// Function to get a color index based on the hash
const getColorIndexForTag = (tag) => {
    const hash = generateHash(tag);
    return Math.abs(hash) % colorPalette.length;
};

const TagWithColor = ({ tag }) => {
    const colorIndex = getColorIndexForTag(tag);
    const tagColor = colorPalette[colorIndex];

    return (
        <div
            style={{
                backgroundColor: tagColor,
            }}
            className="py-[3px] px-[8px] text-[10px] rounded text-white"
        >
            {tag}
        </div>
    );
};

export default TagWithColor;
