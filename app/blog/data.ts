export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  scripture: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  image: string;
  featured: boolean;
  tags: string[];
  is_published?: boolean;
}

export const CATEGORIES = ['All', 'Devotional', 'Bible Study', 'Testimony', 'Youth', 'Announcement'];

export const POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'walking-in-faith-through-uncertain-times',
    title: 'Walking in Faith Through Uncertain Times',
    excerpt: 'When the storms of life seem overwhelming, the Word of God reminds us that our steps are ordered by the Lord. A reflection on trusting God in seasons of uncertainty.',
    content: [
      'There are seasons in life when the road ahead seems unclear, when the weight of circumstances presses down on every side, and when the future holds more questions than answers. These are the seasons that test what we truly believe about God — not just what we say we believe, but what we live by.',
      'The Word of God does not promise that faith will keep us from storms. Rather, it promises that in the midst of every storm, God holds our hand. "The steps of a good man are ordered by the LORD: and he delighteth in his way. Though he fall, he shall not be utterly cast down: for the LORD upholdeth him with his hand." (Psalm 37:23-24)',
      'Walking in faith is not the absence of fear — it is the decision to move forward in spite of it. Faith says: I do not understand this moment, but I know the One who holds this moment in His hands. When the apostles found themselves in a storm on the Sea of Galilee, Jesus was in the boat with them (Mark 4:35-41). He did not prevent the storm; He was present through it.',
      'Practically speaking, faith in uncertain times looks like this: continuing in prayer even when the heavens seem silent, continuing in worship even when your heart is heavy, and continuing to speak the Word of God even when your circumstances contradict it. "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths." (Proverbs 3:5-6)',
      'At AFM Chegutu, we believe that the same God who parted the Red Sea, who shut the mouths of lions for Daniel, and who raised Lazarus from the dead — is the God who walks beside you today. Whatever you are facing, bring it to Him. He is faithful.',
      'Let us commit together to walk in faith this season — not by sight, not by feeling, but by the unchanging, unshakeable Word of the living God. His plans for you are good. (Jeremiah 29:11)',
    ],
    scripture: 'Psalm 37:23',
    category: 'Devotional',
    author: 'Rev. Lirani',
    authorRole: 'Senior Pastor',
    date: '2026-04-20',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=1400',
    featured: true,
    tags: ['faith', 'trust', 'prayer'],
  },
  {
    id: '2',
    slug: 'baptism-of-the-holy-spirit',
    title: 'The Baptism of the Holy Spirit: What the Bible Teaches',
    excerpt: 'One of the foundational doctrines of the Apostolic Faith Mission is the baptism of the Holy Spirit with the evidence of speaking in other tongues. Let us explore what Scripture says.',
    content: [
      'On the day of Pentecost, something extraordinary happened. "And they were all filled with the Holy Ghost, and began to speak with other tongues, as the Spirit gave them utterance." (Acts 2:4). This event marks the fulfilment of Jesus\'s promise to His disciples and the birth of the New Testament church.',
      'The baptism of the Holy Spirit is distinct from salvation. When a person believes in Jesus Christ and confesses Him as Lord, they are born again (Romans 8:9). The baptism of the Holy Spirit is a subsequent experience — an endowment of power for service. Jesus said, "But ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me." (Acts 1:8)',
      'The initial physical evidence of the Holy Spirit baptism is speaking in other tongues as the Spirit gives utterance (Acts 2:4, Acts 10:44-46, Acts 19:6). This is consistent throughout the book of Acts wherever the Holy Spirit was poured out. It is not merely an emotional experience — it is a sovereign act of God.',
      'Joel 2:28 promised: "And it shall come to pass afterward, that I will pour out my spirit upon all flesh." Peter declared on Pentecost: "For the promise is unto you, and to your children, and to all that are afar off, even as many as the Lord our God shall call." (Acts 2:39)',
      'At AFM Chegutu, we regularly see believers filled with the Holy Spirit, speaking in tongues and going on to live transformed, fruitful lives. If you have not yet received the baptism of the Holy Spirit, seek God with an open and willing heart. He is more willing to give the Holy Spirit to those who ask than any earthly father (Luke 11:13).',
      'This doctrine is not peripheral — it is at the heart of the apostolic mission. The Holy Spirit equips us, guides us, prays through us, and empowers us for the Great Commission. May every believer at AFM Chegutu know this experience personally.',
    ],
    scripture: 'Acts 2:4',
    category: 'Bible Study',
    author: 'Rev. Lirani',
    authorRole: 'Senior Pastor',
    date: '2026-04-14',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1400',
    featured: false,
    tags: ['holy spirit', 'doctrine', 'pentecost'],
  },
  {
    id: '3',
    slug: 'testimony-gods-faithfulness',
    title: 'Testimony: How God Turned My Mourning Into Dancing',
    excerpt: 'When I lost my job and my marriage was under strain, I had nothing left to hold on to but God. This is the story of how His faithfulness carried me through the darkest valley.',
    content: [
      'I never thought I would be the one standing up in church to share a testimony. I was always the quiet one in the pew, watching others weep with joy as they spoke of God\'s goodness. I was thankful — but I had not yet experienced the kind of breakthrough that makes you run to the front.',
      'In 2024, I lost my job. Three months later, my spouse and I were barely speaking. The house felt cold. The bills were mounting. I prayed, but my prayers felt like they were hitting the ceiling. I kept going to church — not because I felt like it, but because I had nowhere else to go.',
      'It was a Wednesday evening, during Bible study here at AFM Chegutu, that something shifted. The preacher was reading from Isaiah 43:2: "When thou passest through the waters, I will be with thee." I had read that verse a hundred times. That night, it went from words on a page to a hand that reached into my chest and steadied my heart.',
      'I gave my situation completely to God that night. Not because I had a breakthrough — but because I had nothing left to hold onto. And that, I believe, is exactly where God wanted me.',
      'Within six weeks, I was offered a better position than the one I had lost. My spouse and I started attending the couples\' fellowship, and slowly, God began to restore what had been broken. Today, our home is filled with laughter. Our children see parents who pray together.',
      'I am sharing this not to boast, but to tell you — if you are in the valley right now, God sees you. He has not forgotten you. Your weeping may endure for a night, but joy comes in the morning. (Psalm 30:5) Hold on. He is faithful.',
    ],
    scripture: 'Isaiah 43:2',
    category: 'Testimony',
    author: 'A Church Member',
    authorRole: 'AFM Chegutu Congregation',
    date: '2026-04-10',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1400',
    featured: false,
    tags: ['testimony', 'faithfulness', 'hope'],
  },
  {
    id: '4',
    slug: 'youth-camp-2026',
    title: 'Youth Camp 2026: Seeds Planted, Lives Transformed',
    excerpt: 'Thirty-four young people. Five days. One powerful encounter with God. Here is what happened at our annual youth camp and why this generation gives us so much hope.',
    content: [
      'Every year, we send our young people to youth camp with bags full of clothes and hearts full of excitement. Every year, they come back different. But this year — something was especially remarkable.',
      'This year\'s AFM Youth Camp was held at a retreat centre outside Harare. Thirty-four young people from AFM Chegutu attended, ranging from 13 to 25. The theme was drawn from Jeremiah 29:11: "For I know the plans I have for you." Every session and campfire conversation was anchored around this truth: God has a plan for your life.',
      'On day three, during an extended evening prayer session, six young people received the baptism of the Holy Spirit for the first time. Three others gave their lives to Christ. The presence of God was so tangible that the session that was planned for one hour ran past midnight as the young people refused to leave.',
      'One of the camp leaders shared: "I have never seen young people hunger for God the way these ones did this year. There was no performance — just genuine seeking." Several of the youth have since joined our prayer team and choir.',
      'We want to express deep gratitude to all the parents who trusted us with their children, to our youth pastors and camp volunteers who poured themselves out for five days, and to all who covered the camp in prayer and financial support.',
      'The next generation of this church is not lost. They are hungry, they are bold, and they are being equipped for the purposes of God. We cannot wait to see what He does through them.',
    ],
    scripture: 'Jeremiah 29:11',
    category: 'Youth',
    author: 'Youth Ministry Team',
    authorRole: 'AFM Youth Department',
    date: '2026-04-05',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&q=80&w=1400',
    featured: false,
    tags: ['youth', 'camp', 'revival'],
  },
  {
    id: '5',
    slug: 'divine-healing-bible-promise',
    title: "Divine Healing: God's Unchanging Promise for Today",
    excerpt: 'Is healing in the atonement? Can believers today expect God to heal sickness and disease? A careful look at what the scriptures teach about divine healing.',
    content: [
      'One of the most glorious doctrines of the Apostolic Faith Mission is our belief in divine healing. We do not merely believe that God can heal — we believe that healing is part of the finished work of Christ on the cross, available to every believer who comes to Him in faith.',
      '"But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed." (Isaiah 53:5). This verse is quoted by the apostle Peter (1 Peter 2:24), confirming that it speaks not only of spiritual healing but of physical healing as well.',
      'When Jesus walked on this earth, healing was central to His ministry. He healed every manner of disease and sickness (Matthew 4:23). He commissioned the twelve to "heal the sick" (Matthew 10:8). James 5:14-15 instructs the elders to anoint the sick with oil and pray, promising that "the prayer of faith shall save the sick, and the Lord shall raise him up."',
      'Divine healing is not about the strength of our faith — it is about the faithfulness of our God. We do not command God; we humbly come to Him. Sometimes He heals instantly. Sometimes healing comes progressively. But we never stop believing, and we never stop praying.',
      'At AFM Chegutu, we have testimonies of people healed of tumours, of restored sight, and of bodies restored to full health. We share these not to create pressure but to build faith — faith in a God who is the same yesterday, today, and forever. (Hebrews 13:8)',
      'If you are sick today, we invite you to come forward during any of our services for prayer. Our elders are available. God has not changed. His promises have not expired. He is still the LORD who heals. (Exodus 15:26)',
    ],
    scripture: 'Isaiah 53:5',
    category: 'Bible Study',
    author: 'Rev. Lirani',
    authorRole: 'Senior Pastor',
    date: '2026-03-28',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&q=80&w=1400',
    featured: false,
    tags: ['healing', 'doctrine', 'faith'],
  },
  {
    id: '6',
    slug: 'sunday-school-renovation-complete',
    title: 'Sunday School Renovations Complete — A New Season for Our Children',
    excerpt: 'After three months of construction and generous giving from our congregation, we are thrilled to announce that our Sunday School wing is fully renovated and ready.',
    content: [
      'We are overjoyed to announce that the Sunday School renovation project is now complete! What began as a vision shared during our January family service has, through the grace of God and the generosity of this congregation, become a beautiful reality.',
      'The renovated wing now features three bright, colourful classrooms designed specifically for children from ages 3 to 12. Each classroom has new furniture, educational materials, a dedicated craft area, and a warm environment where children can encounter God in a way that is meaningful to them.',
      'This project was funded entirely through voluntary offerings from our congregation. We received contributions ranging from building materials to financial gifts to the physical labour of church members who gave up weekends to paint, clean, and build. We are deeply grateful.',
      'Sister Rutendo, our Sunday School coordinator, says: "We have always believed that the children of this church deserve the best environment to learn about Jesus. This new space will allow us to welcome more children into the Kingdom."',
      'A dedication and open-day service will be held on the first Sunday of next month. All families are warmly invited to come and see the new facilities. Children will receive a special gift, and we will pray a blessing over the space.',
      '"Jesus said, Suffer little children, and forbid them not, to come unto me: for of such is the kingdom of heaven." (Matthew 19:14). We look forward to welcoming many more children into this special place.',
    ],
    scripture: 'Matthew 19:14',
    category: 'Announcement',
    author: 'Church Office',
    authorRole: 'AFM Chegutu Administration',
    date: '2026-03-15',
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1400',
    featured: false,
    tags: ['announcement', 'children', 'building'],
  },
];

export function categoryStyle(cat: string): string {
  const m: Record<string, string> = {
    'Devotional':   'bg-[#86BBD8]/20 text-[#2A4D69] border-[#86BBD8]/30',
    'Bible Study':  'bg-[#78C0A6]/20 text-emerald-800 border-[#78C0A6]/30',
    'Testimony':    'bg-amber-100   text-amber-800   border-amber-200',
    'Youth':        'bg-blue-100    text-blue-800    border-blue-200',
    'Announcement': 'bg-[#6B7B8E]/15 text-[#2A4D69] border-[#6B7B8E]/25',
  };
  return m[cat] || 'bg-gray-100 text-gray-700 border-gray-200';
}
