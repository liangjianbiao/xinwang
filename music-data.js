/**
 * 音乐数据源文件
 * 根据心理网站/音乐文件夹下的实际文件生成
 * 总计 486 首音乐，15 种类型
 *
 * 数据结构说明：
 *   MOOD_CONFIG  - 类型配置（名称、图标）
 *   MUSIC_GROUPS - 按类型分组的音乐文件名（不含扩展名）
 *   MUSIC_DATA   - 自动生成的完整音乐数据库
 */

// 音乐类型配置
var MOOD_CONFIG = {
    angry:       { name: "生气的",      icon: "🔥" },
    dark:        { name: "黑暗的",      icon: "🌑" },
    epic:        { name: "史诗",        icon: "⚔️" },
    stylish:     { name: "时髦",        icon: "💅" },
    funny:       { name: "有趣的",      icon: "🤪" },
    happy:       { name: "快乐的",      icon: "😊" },
    inspiring:   { name: "激励和启发",   icon: "✨" },
    mysterious:  { name: "神秘",        icon: "🔮" },
    panic:       { name: "恐慌",        icon: "😰" },
    calm:        { name: "平静而放松",   icon: "🧘" },
    romantic:    { name: "浪漫的",      icon: "💕" },
    sad:         { name: "伤心",        icon: "😢" },
    horror:      { name: "可怕的恐怖",  icon: "👻" },
    suspense:    { name: "悬疑",        icon: "🔍" },
    optimistic:  { name: "乐观",        icon: "🌟" }
};

// 按类型分组的音乐文件名（不含 .mp3 扩展名）
var MUSIC_GROUPS = {

    // ========== 生气的 (5首) ==========
    angry: [
        "Mighty_Russia", "Whiskey_Bar_Blues", "Final_Boss", "Rage_Quit", "Brutality"
    ],

    // ========== 黑暗的 (104首) ==========
    dark: [
        "Preparation", "Epic_Build_Up", "Epic_Drums_Part_1", "A_Search_for_the_Hidden",
        "Epic_Trailer_Build_2", "Day_of_Exile", "Brink", "Bold",
        "City_of_Ruins", "Chase_Scene_Music", "Hybrid_Chaos", "Conspiracy",
        "Times", "Hybrid_Enemy", "Gym_Workout", "Mystery",
        "Panic_Man", "Headache", "The_Lost_Tron", "Looking_For_Trouble",
        "Ruins_Soundtrack", "Deserted", "Documentary_Music_1", "Dying",
        "Epic_Intro_Music", "Secret_Soldiers", "Chase_Scene_Music_2", "Panic_Man_3",
        "Dark_Hero", "Bourne_Identity_Flashback_Scene_Music_Cover", "Orc_Warcry", "Random_Music",
        "Space_Conspiracy", "Sarah_Soundtrack", "Tragedy", "A_New_Day_Is_Coming",
        "Runner", "On_Fire", "Investigations", "Secrets",
        "Ninja_Fight", "Doubt", "Dark_Conspiracy", "Unattainable",
        "Vengeance", "Journey_of_Demise", "Aggression", "Tensions",
        "Scouting_Mission", "A_Dark_Time", "Darkness_Arrives", "Destruction",
        "Detective_Caution", "Ticking", "Descendants", "It_Was_Midnight",
        "The_Dark_Castle", "Blood_Money", "Super_Hero_Showdown", "Titan_Revenge",
        "Unfolding_Revelation", "Monster_In_The_Field", "Retribution", "Video_Game_Adventure",
        "Crazy_Drummer", "Venomous", "Paranoia", "Fire_Style",
        "The_Chase_of_My_Life", "Halloween", "The_Unsolved_Murder", "The_Epic_Boss_Fight",
        "It_Is_Coming", "A_World_In_Trouble", "Escape_Chase", "Without_God",
        "Training", "Fear", "Creepy_Vibes", "Fight_Or_Flight",
        "No_More_Good", "Villainous", "Evil_Rising", "Anxiety",
        "Dark_Shadows", "Behind_You", "Conspiracy_Theory", "Ghost_Stories",
        "Cold_World", "Haunted_Memories", "Distorted_Doom", "Imminent_Threat",
        "Looking_For_Clues", "Detective_Revelation", "Dark_Tunnel", "Panic_Attack",
        "Skin_Of_Your_Teeth", "Monster_Heat", "Police_Raid", "Mr_Wick",
        "Anticipation", "Trouble_Is_Brewing", "Too_Crazy", "Undercover_Spy_Agent"
    ],

    // ========== 史诗 (90首) ==========
    epic: [
        "We_Will_Rise_Again", "Epic_Instrumental_2", "This_Day_We_Die", "Defense",
        "Dramatic_Scene_Ending_Music_1", "Dramatic_Scene_Ending_Music_2", "Beginning_to_See", "Darkness_Approaches",
        "A_Heros_Defeat", "Never_Back_Down", "Reborn", "Glimmer",
        "Death_of_Cellos_Groove", "Beginnings", "Take_Down", "Apocalyptic_End",
        "The_Vanished_Island", "Preparation_2", "Fight_Dance", "Desperation",
        "Skies", "Enemy", "Glory", "Take_Down_2",
        "Father_Forgive_Them", "Overcomer", "Destructor", "Battle_of_the_Awake",
        "Healing", "The_Fire_of_The_Storm", "Victory", "Sacrifice",
        "Can_it_be", "Motivation", "The_Final_Two", "Spirit",
        "Our_Memories", "Super_Hero", "The_Climb", "Why",
        "Worlds", "Believe", "Assault_Encounter", "We_Need_A_Hero_-_Trailer_Music",
        "Born_Again", "Radiance", "Independence", "Blue_Skies",
        "Death_Note_Tribute", "The_Power_Of", "Tears_And_Joy", "Action_Crave",
        "Tears_of_Joy", "Starry_Dream", "Drum_Commercial_C", "New_Heights",
        "I_Am_Iron", "Blood_Pumping", "Forever", "Western_Adverntures",
        "The_Last_Time", "Dragon_Boss_Fight", "Torn", "Beyond_The_Stars",
        "Go_Beyond", "Super_Suspense", "Ethereal", "The_Hero_We_Need",
        "Warrior_Gods", "Viking_Feast", "Ogre_Boss", "Drum_Commercial_B",
        "Dark_Angel", "Cloak_And_Dagger", "Raging_Tides", "Escape_Route",
        "Age_Of_Mythology", "Solar_Savior", "Brace_For_Impact", "Fire_Emblem",
        "Clash_Of_Heroes", "Preparing_For_Battle", "Machine_Gun_Roll", "Divine_Ascension",
        "His_Fight_Is_Over", "Journey_To_The_Promise", "Dragon_Level", "Devils_Squid_Game",
        "War_Crown", "Powerful"
    ],

    // ========== 时髦 (27首) ==========
    stylish: [
        "Funktastic", "A_Rockin_Time", "Too_Fly", "Get_Ready",
        "I_Was_Joking", "Big_Band", "Feels_Good", "Feeling_The_Best",
        "We_Groove", "Slick_Move", "Livin_Funky", "Shakalaka",
        "8_Bit_Retro_Funk", "Ready_For_Mischief", "Can't_Touch_Me", "Sleuthing_In_The_Dark",
        "Happy-Go-Lucky", "The_Way_Things_Used_To_Work", "Smilin'_And_Vibin'", "Italian_Fun",
        "Cooking_With_The_Italians", "Retro_Jokester", "We_Be_Vibin", "Morning_Refresher",
        "Elevator_Dreamin", "Silly_Bank_Heist", "Too_Much_Funk"
    ],

    // ========== 有趣的 (53首) ==========
    funny: [
        "Dummy", "La_La_Land", "You_Just_Got_Pwned", "Like_a_Boss",
        "The_Night_Before_Christmas", "Marching_Elves", "Back_And_Forth_Game", "Such_A_Troll",
        "Eye_Laugh", "Marvelous_Mischief", "Absurd", "Curious_Tip_Toe",
        "Funny_Chase_Music_A", "Slow_Funny_Music_A", "Goofy_Prank", "Upbeat_Funny_Dance",
        "Slow_Laugh", "ROFL", "Awkward", "Snap_Along",
        "Elevator_Ride", "The_Biggest_Smile", "Circus_Calliope", "Island_Mambo",
        "Sensual_Bolero", "First_Touch", "Crazy_Crowd", "Fancy_Date",
        "Its_A_Good_Day", "A_Day_In_Shanghai", "Tarantella", "Italian_Opera",
        "Partying_In_Russia", "Slavic_Drinking_Song", "Lounge_Bossa", "Samba_Party",
        "Funny_Bit", "Crazy_Holidazy", "Lazy_Grin", "Dancing_Silly",
        "Pig_In_The_Mud", "Cat_And_Mouse", "Derp", "Chicken_Chase",
        "Lounge_Noir", "Swingin_Yuletide", "Step-by-step", "A_Slight_Mix-up",
        "Ride_The_Mellow-vator", "Moron", "Seriously", "Sneaky_Rascal",
        "Silly_Chicken"
    ],

    // ========== 快乐的 (46首) ==========
    happy: [
        "Holiday_Hustle", "Life_At_The_Inn", "Jump_Time", "A_Fresh_Thought",
        "The_Town_Of_Our_Youth", "Joy", "A_New_Way", "We_Fought_For_Freedom",
        "Strings_of_Time", "Unseen_Affection", "Tiny_Kingdom", "Childhood_Nostalgia",
        "Delightful_Banquet", "Happy_Streams", "Pirate_Dance", "Forest_Ventures",
        "Dreams_of_a_Child", "Beach_Boogie", "8_Bit_Menu", "Happy_Tree",
        "In_A_Jiffy", "Fist_Bump", "Like_Ras", "Track_A",
        "Trusted_Advertising", "Commercial_Bliss", "Warm_Light", "Feels_Good",
        "Feeling_Happy", "A_Better_Life", "Touch_Of_Love", "Solutions_That_Work",
        "Sonata_Rondo", "Strings_Galore", "The_Wrong_Side_Of_Town", "Easy_Going",
        "Tropical_Keys", "Feeling_Free", "Happy_Feet", "Prairie_Evening",
        "Soaring_Through_The_Skies", "Information_Regime", "A_Happy_Christmas", "Super_Spiffy",
        "Beautiful_Memories", "Happy_Dreams"
    ],

    // ========== 激励和启发 (31首) ==========
    inspiring: [
        "Winters_Wish", "Preparing_For_Santa", "Sentimental_Dialogue", "Training_Journey",
        "I_See_Beauty", "Emotion", "They_Said_I_Cant", "Inspired_Thinking",
        "Together_We_Can", "Flying_High", "Rise_Up", "At_The_Top",
        "An_Adventure_Ahead", "Young_Fire", "Consciousness", "Our_Hopes_And_Dreams",
        "Overcome", "Black_Rosary", "Soaring_Sleighride", "Swan_Dive",
        "Early_Christmas_Morning", "Speed_Of_Life", "Songbirds_Cry", "Requiem",
        "Todays_Headlines", "Anhedonia", "Dreaming_In_Solitude", "Saying_Goodbye",
        "I_Wish_I_Told_You", "Inspirational_Advertising_1", "Powerful"
    ],

    // ========== 神秘 (10首) ==========
    mysterious: [
        "Land_of_Fantasy", "Edge_of_Conspiracy", "Dark_Spy", "Dark_Fog",
        "Solving_The_Crime", "Background_Check", "Scene_Of_The_Crime", "Witness_Testimony",
        "Airlock", "Contact_With_The_Unknown"
    ],

    // ========== 恐慌 (12首) ==========
    panic: [
        "Orc_Chase", "Action_Fight", "Poisonous", "Horror_Chase_Chapter_1",
        "Horror_Chase_Chapter_2", "Torture_Chamber", "House_Of_Horros", "No_Way_Out",
        "Right_Behind_You", "Predator_And_Prey", "Space_Debris", "Hot_Pursuit"
    ],

    // ========== 平静而放松 (47首) ==========
    calm: [
        "Land_of_8_Bits", "Lazy_Day", "Done_With_Work", "Vibes",
        "Cruisin_Along", "Mellow_Thoughts", "Looking_Up", "Simplicity",
        "All_Shall_End", "Peace", "An_Ambient_Day", "Peace_And_Happy",
        "Sad_Winds_Chapter_1", "Tender_Love", "Chill_Gaming", "Homework",
        "On_My_Own", "Love_Spell", "Fireside_Date", "The_Lounge",
        "Elven_Forest", "Healing_Water", "Not_Much_To_Say", "The_Soft_Lullaby",
        "Relaxing_Green_Nature", "We_Were_Friends", "In_The_Moment", "Champagne_at_Sunset",
        "Serenity", "Cathedral_Ambience", "Stasis", "Painful_Memories",
        "Upon_Reflection", "Down_Days", "Time_Alone", "Beauty_Of_Russia",
        "Rolling_Hills_Of_Ireland", "Irish_Sunset", "Heaven", "Country_Fireside",
        "Glistening_Gifts", "Broken_Inside", "News_Chill", "Wishing_Well",
        "Deep_Meditation", "Quiet_Time", "Tranquility"
    ],

    // ========== 浪漫的 (11首) ==========
    romantic: [
        "The_Two_Of_Us", "Lovers", "Move_Together", "Classic_Love_Scene",
        "Night_To_Remember", "Talk_To_Me", "Proud_And_Gentle", "Under_A_Dim_Lantern",
        "I_Waited_For_You", "Wistful_Heart", "Festive_Fireside"
    ],

    // ========== 伤心 (26首) ==========
    sad: [
        "This_is_it", "I_can_make_it_right", "If_Only_You_Knew", "Fireplace_Thinking",
        "I_Still_Feel_Your_Heart", "I_Walk_Alone", "Regrets", "O_Come_O_Come_Emmanuel",
        "Forgotten", "Adam_Contest", "Broken_Village", "Tough_Times",
        "Lives_Lost", "Grief_And_Emptiness", "I_Remember_You", "The_Pain_That_Never_Left",
        "A_Sad_Meme", "Darkest_Hour", "Lost_Souls", "Emotional_Regret",
        "Whiskey_Woes", "Sad_Winds_Ch_2", "Goodbye,_My_Friend", "Cold_Isolation",
        "Tears_Wont_Stop", "Please_Dont_Cry"
    ],

    // ========== 可怕的恐怖 (4首) ==========
    horror: [
        "Scarey_Atmospheres_Chapter_1", "Scarey_Atmospheres_Chapter_2",
        "Scarey_Atmospheres_Chapter_3", "Dark_Winds_Chapter_1"
    ],

    // ========== 悬疑 (8首) ==========
    suspense: [
        "Short_Tension_1", "Assault_Team_1", "Save_The_Hostage", "Orchestra_Battle_Fight",
        "Ready_to_Fight", "News_Countdown", "Fantasy_Ambience", "Sneaky_Action"
    ],

    // ========== 乐观 (12首) ==========
    optimistic: [
        "I_Dont_Wanna_Dance", "Fight_Me_If_You_Can", "Strollin_Along", "Bumping",
        "Bold_Statement", "Shire_Girl", "Thrill_Of_The_Holiday", "Christmas_Rock",
        "Swinging_Sixties", "Hoedown_Hustle", "Beachside_Liqueur", "Frosted_Frenzy"
    ]
};

// ========== 自动生成完整音乐数据库 ==========
var MUSIC_DATA = [];
var _musicId = 1;

Object.keys(MUSIC_GROUPS).forEach(function(moodKey) {
    var config = MOOD_CONFIG[moodKey];
    var folder = config.name;
    MUSIC_GROUPS[moodKey].forEach(function(fileName) {
        // 将文件名转换为可读标题（下划线替换为空格）
        var title = fileName.replace(/_/g, ' ');
        MUSIC_DATA.push({
            id: _musicId++,
            title: title,
            mood: moodKey,
            moodName: config.name,
            cover: config.icon,
            file: "音乐/" + folder + "/" + fileName + ".mp3"
        });
    });
});

// 统计信息
var MUSIC_STATS = {
    total: MUSIC_DATA.length,
    moodCount: Object.keys(MUSIC_GROUPS).length,
    moodCounts: {}
};
Object.keys(MUSIC_GROUPS).forEach(function(key) {
    MUSIC_STATS.moodCounts[key] = MUSIC_GROUPS[key].length;
});
