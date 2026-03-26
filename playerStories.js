const PLAYER_STORIES = {
  'Amanjot Kaur': `Under the bright floodlights and echoing cheers, Amanjot Kaur stands tall at the crease — a name that once belonged to a quiet girl from Mohali, now etched into the storybook of Indian cricket. With every powerful stroke and calm glance at the field, she writes her own chapter in the game once thought too big a dream for small-town girls.

Born and raised in Punjab, Amanjot wasn't handed an easy pitch. Her cricketing journey began with borrowed kit bags, early morning training sessions, and countless hours spent on dusty grounds where ambition outshone facilities. Yet, what she lacked in opportunity, she made up for in resolve. Coaches soon saw her rare balance — aggression in her bat and serenity in her mind.

When Amanjot debuted for India in 2023, she didn't just play — she announced herself. In her first T20I against South Africa, she smashed vital runs under pressure, proving she was not here for cameos but for legacy. Her performances earned her a place among emerging stars — her name spoken with respect in dressing rooms and delight from fans who saw a fearless new face for India.

Today, Amanjot represents more than skill; she embodies evolution — of women's cricket, of dreams turning real, of every young girl who picks up a bat believing she can, too. Her story isn't just about cricket. It's about courage, persistence, and the sound of boundaries breaking — both on and off the field.`,

  'Anjali Sarvani': `Under the soft morning light in Kurnool, a young left-arm pacer ran in on a dusty ground, a tennis ball clutched in her hand and a quiet fire in her eyes. That girl was Anjali Sarvani, and every time she knocked over the stumps, the surprised laughter around her slowly turned into admiration.

From street cricket to state teams like Andhra and then the powerful Railways side, Anjali climbed each step the hard way, carrying her dream through long journeys, tough trials, and high-pressure matches. Her smooth left-arm action, late swing, and fearless attitude made her a captain's hidden weapon — the bowler you trusted when the game started slipping away.

When she finally walked out in India colours for her T20I debut, it wasn't just another match. It was years of sacrifice stitched into one jersey, a message to every small-town girl that the distance from a dusty pitch to the international stage can be crossed. Today, Anjali Sarvani is more than a left-arm pacer; she is a reminder that where you start matters less than how stubbornly you keep running in, ball after ball, dream after dream.`,

  'Arundhati Reddy': `Under Hyderabad's relentless sun, a 12-year-old Arundhati Reddy gripped her first cricket ball, her mother's volleyball grit fueling her fire. From backyard swings to captaining Hyderabad's U19 side at 15, she switched to right-arm pace and never looked back.

Domestic glory with Railways led to her 2018 T20I debut against Sri Lanka, then India's T20 World Cups in 2018, 2020, and 2024. She dominated in Australia too — taking 4/26 in a 2024 ODI at WACA to dismantle their top order, then a career-best 4/22 in the 2026 1st T20I at SCG, collapsing Australia to 133 all out for a rain-hit Indian win.

Now with Royal Challengers Bengaluru in the WPL, Arundhati's handy batting and clutch wickets prove she's built for big moments — a Hyderabad hustler showing girls everywhere that pace and heart conquer all.`,

  'Bharti Fulmali': `From Amravati's dusty maidans, 13-year-old Bharti Fulmali picked up a bat, turning street games into senior debuts by 17 for Vidarbha. Her middle-order firepower — 133 runs at a strike rate of 172 in WPL 2025 — made her a finisher teams crave, smashing sixes that shifted match tempo against giants like Mumbai Indians.

India's 63rd T20I cap in 2019 against England marked her brief international bow, but WPL with Gujarat Giants reignited her spark, blending grit and explosive hitting. Today, Bharti's raw emotion and big shots inspire small-town dreamers: proof that late bloomers can still steal the show.`,

  'Dayalan Hemalatha': `From Chennai's bustling streets, Dayalan Hemalatha honed her all-rounder edge — right-hand power hitting fused with crafty off-spin — rising through Tamil Nadu to Railways dominance.

Her T20I debut dazzled at the 2018 World Cup with 3/15 vs New Zealand, while WPL stints (Gujarat Giants to RCB) delivered 300+ runs at 122 SR, including a fiery 74 off MI. Now with Perth Scorchers in WBBL, she's the middle-order spark and handy bowler proving Tamil grit lights up global stages.`,

  'Deepti Sharma': `From Agra's simple streets, teenage prodigy Deepti Sharma debuted for India at 17, stunning with 2/35 in her first ODI against South Africa. She shattered records early — 188 off 160 balls in a 320-run opening stand vs Ireland (highest in women's ODIs then) — and became the first Indian woman with 1000 T20I runs and 150 wickets.

Her all-round mastery peaked in the 2025 Women's Cricket World Cup: Player of the Tournament with 215 runs and 22 wickets, including a match-winning 5-fer in the final that sealed India's historic first title. UP Warriorz's WPL MVP (hat-trick, 295 runs/10 wickets in 2024), Deepti embodies relentless brilliance — a true match-winner for the ages.`,

  'G Kamalini': `From Madurai's vibrant streets, 17-year-old prodigy Gunalan Kamalini exploded onto the scene — left-hand opener, wicketkeeper, and leg-spinner — who captained Tamil Nadu U19 to national glory in 2024 with 311 runs.

Bought for ₹1.6 crore by Mumbai Indians in WPL 2025, she shone in U19 T20 World Cup triumphs (Team of Tournament) before her senior T20I debut vs Sri Lanka in December 2025, juggling catches and quick chases with fearless flair. Kamalini's the teenage dynamo proving age is no barrier to wearing India blue.`,

  'Harleen Deol': `From Chandigarh's competitive pitches, Harleen Deol emerged as a dynamic all-rounder — right-hand batter, leg-spinner, and acrobatic fielder — shifting to Himachal Pradesh for bigger dreams.

Her viral 2021 boundary-line catch vs England (praised by Sachin Tendulkar) went global, while her maiden ODI ton (115 off 103) came vs West Indies in 2024; she added 232 WPL runs in 2025 before helping India win the 2025 Women's Cricket World Cup. Now with UP Warriorz, her fearless 64* silenced 2026 critics — a resilient star blending flair and fight.`,

  'Harmanpreet Kaur': `In the dusty fields of Moga, Punjab, a young Harmanpreet Kaur chased a dream bigger than her small-town roots — sneaking out for secret net sessions, defying odds with every defiant cover drive. From those humble beginnings, she transformed into India's fearless captain, proving one girl's grit could ignite a nation's cricket revolution.

Her legendary 171* in the 2017 World Cup semi-final turned heartbreak into history, nearly toppling Australia single-handedly; she became the first Indian woman to score a T20I century (103* vs England) and led India to Asia Cup glory, Asian Games gold, and their historic 2025 ODI World Cup triumph — chasing 339 with a match-winning 89.

Today, with 360+ caps and back-to-back WPL titles as Mumbai Indians captain, Harmanpreet stands tall: a beacon for every dreamer, whispering that courage and clean hitting can rewrite destinies.`,

  'Jemimah Rodrigues': `In the buzzing maidans of Mumbai, a young girl with a bat bigger than her dreams began crafting magic. Jemimah Rodrigues didn't just play cricket — she painted it. Every cover drive flowed like poetry, every single she stole showed intelligence beyond her years. At just 17, she announced her arrival with a fearless 37 on debut, hinting at a future India couldn't ignore.

But her journey wasn't just about elegance — it was about evolution.

From a promising teen to India's dependable middle-order pillar, Jemimah transformed her game with courage. She smashed a double century in domestic cricket, and in 2025, she reached a personal milestone — her maiden international century — proving she belonged among the best.`,

  'Kashvee Gautam': `From Chandigarh's local pitches, Kashvee Gautam burst forth as a swing-bowling prodigy — taking all 10 wickets in a U19 innings (including a hat-trick) against Arunachal Pradesh in 2020, a feat that earned national headlines and the BCCI's Best Junior Domestic Cricketer award.

Snapped up for a record ₹2 crore by Gujarat Giants in WPL 2024 (though injury struck), she roared back in 2025 with 11 wickets (best: 3/11), powering GG to playoffs before her ODI debut vs Sri Lanka. Overcoming two major knee injuries, she scripted history as Chandigarh's first woman Test cricketer in March 2026 vs Australia in Perth — unbeaten 34 at No.7 stabilizing India, plus BCCI Grade C retainership — proving resilience turns setbacks into Test caps.`,

  'Kranti Gaud': `In the dusty lanes of Ghuwara village, Madhya Pradesh, barefoot Kranti Gaud chased dreams amid heartbreak — her father sacked as a police constable in 2012, her mother selling gold jewellery so Kranti could grip a cricket ball. Told "girls don't play," she defied taunts, training on uneven grounds until coach Rajiv Bilthare spotted her raw pace in 2017, waiving fees, gifting spikes, and giving her a home to chase her fire.

That grit powered her rise: 4/17 in the 2025 Senior Women's ODI Trophy final for Madhya Pradesh's title, a ₹10 lakh UP Warriorz WPL deal (dismissing Meg Lanning first ball), and a T20I debut vs England. Her pinnacle? A match-winning 3/20 vs Pakistan in the 2025 Women's World Cup — sparking India's historic victory — while her 6/52 five-for vs England made her India's youngest ODI fifer holder.

Kranti's triumph restored her father's job through the Chief Minister's promise, turning family tears into pride; now she mentors village girls, proving one determined bowler from nowhere can lift a nation and rewrite destinies.`,

  'Meghna Singh': `From Bijnor's modest fields in Uttar Pradesh, Meghna Singh swung her way to dreams — mastering "banana swing" with right-arm medium pace, overcoming domestic grind to debut for India across all formats during the historic 2021 Australia tour.

Unsung hero of Railways' campaigns and Velocity's T20 Challenge, she grabbed eyes with a WPL first: 4 wickets for Gujarat Giants vs Delhi Capitals in 2024, proving late bloomers swing hardest. Through 17 ODIs (16 wickets), a Test cap, and T20 World Cup stints, Meghna's resilience whispers to every underdog: consistent seam and heart outlast the spotlight.`,

  'Minnu Mani': `In Wayanad's lush paddy fields, Kerala, young Minnu Mani dodged doubts and family resistance, sneaking off at dawn — lying about "extra classes" to chase cricket dreams on makeshift pitches, far from any stadium.

Defying poverty and poor facilities, she switched four buses daily for practice, erupting as Kerala's U-23 T20 champion star (188 runs, 11 wickets in 2018) — first from her state to wear India blue in a 2023 T20I debut vs Bangladesh, snaring series-topping 5 wickets.

Delhi Capitals' WPL trailblazer (₹40 lakh in 2026), all-rounder Minnu's grit — plus Asian Games gold — ignites Kerala girls, turning 150-trial turnouts into proof: one persistent heart from nowhere can pioneer a revolution.`,

  'Pooja Vastrakar': `In Shahdol's rugged terrains of Madhya Pradesh, Pooja Vastrakar battled financial hardship and skepticism — starting as a batter before her fiery medium-pace swing unlocked her all-round destiny, debuting for India in 2018 vs South Africa with a gritty half-century in her second ODI.

Defying odds, she powered India's 2022 Commonwealth Games gold, shone in the 2024 T20 World Cup (20 wickets), and erupted in WPL with Mumbai Indians' triumphs — her 4/13 best and lower-order cameos like 37* proving she's built for chaos.

Pooja's relentless journey — from small-town struggles to game-changing strikes — inspires underdogs everywhere: swing with heart, and no pitch is too tough.`,

  'Poonam Yadav': `In Kanpur's crowded maidans, a young Poonam Yadav gripped her leg-spin dreams against all odds — born into humble roots, she turned raw wrist magic into India's T20I wicket-taking throne with 98 scalps, eclipsing legends like Jhulan Goswami.

Her defining spell? A jaw-dropping 4/19 vs Australia in the 2020 T20 World Cup opener, bamboozling Ellyse Perry with a first-ball googly that stunned the world — propelling India forward while peaking at No.3 in ICC T20I rankings. From 2017 World Cup finals to playing every 2018 T20I for India, Poonam's flighted temptations inspire: one flick of the wrist can topple giants.`,

  'Pratika Rawal': `From Delhi's competitive pitches, Pratika Rawal — daughter of BCCI umpire Pradeep Rawal — balanced academics (92.5% in CBSE, psychology grad from Jesus & Mary College) with cricket dreams, training under coach Sharvan Kumar from age 10 while excelling in basketball nationals.

Her explosive rise: unbeaten 161* for Delhi, captaining U23 to finals, then switching to Railways for her 2024 ODI debut vs West Indies (40 & 76 in first two games, dismissing captain Hayley Matthews). Peaks included a maiden 154 vs Ireland (third-fastest Indian ton), fastest to 500 ODI runs (8 innings), and 308 runs as India's No.2 scorer in their 2025 World Cup triumph — her first World Cup century vs New Zealand securing semis despite a final injury.

Psychology-honed resilience turned a father's umpiring passion into her World Cup glory, inspiring scholar-athletes: technique + temperament conquer any crease.`,

  'Priya Mishra': `From Delhi's street cricket battles — where boys teased her for daring to play — 20-year-old Priya Mishra gripped her leg-spin dreams, walking miles to academies, transforming from batter to googly wizard under coach Shravan Kumar.

Defying doubters who saw only a future housewife, she erupted with 23 wickets in 8 domestic ODIs (2023-24 season), a 5/14 vs Australia A, then ODI debut vs New Zealand — now 15 international scalps including WPL stars like Deepti Sharma and Nat Sciver-Brunt for Gujarat Giants.

Her BCCI Best Domestic Cricketer 2025 award cements it: relentless street grit, family faith, and one sharp googly can silence critics and spin India to glory — proof every teased girl can own the World Cup stage.`,

  'Priya Punia': `From Jaipur's sun-baked pitches, Priya Punia honed her patient right-hand technique under Virat Kohli's coach Rajkumar Sharma, transforming teenage promise into international steel — debuting in 2019 T20Is vs New Zealand, then anchoring ODIs with gritty half-centuries like an unbeaten 75 chasing 165 vs South Africa.

A top-order rock for Delhi (consistent domestic tons) and Supernovas, her classical style shone in run-chases and partnerships, proving cricket rewards composure over chaos despite fierce opening battles. Switching to Rajasthan in 2020, Priya's journey — from scholar-batter to reliable opener — inspires: steady technique and quiet resolve build legacies one patient boundary at a time.`,

  'Radha Yadav': `In Mumbai's cramped lanes behind her father's milk stall — where poverty meant one square meal a day and dreams felt like luxuries — young Radha Yadav snuck out to play tennis-ball cricket with boys, her raw left-arm spin catching coach Praful Naik's eye. Defying taunts that girls belonged in kitchens, not nets, her family sold vegetables for her gear; brothers bowled endlessly in narrow alleys while doubters sneered. Naik trained her free, converting her batter's heart into a world-class spinner's steel — she captained Baroda seniors by 2018, silencing every "no" with flighted fire.

That unbreakable grit erupted globally: joint-top wicket-taker (8 scalps) at the 2018 T20 World Cup, a historic 5/25 in Women's T20 Challenge final (first ever), and key spells in India's 2025 ODI World Cup triumph — 4 wickets across knockout stages, including Bangladesh's captain run-out via instinct, proving self-belief turns slums into stadiums.

Today, Radha's journey — from benched battles to match-winner with her father carrying the trophy on his head — roars to every girl in the shadows: one compact action, family faith, and relentless positivity can spin poverty into World Cup gold.`,

  'Rajeshwari Gayakwad': `In Indi's vibrant gullies of Maharashtra, Rajeshwari Gayakwad gripped her first ball amid dreams too big for her small frame — rising from domestic grind with Railways to India's slow left-arm maestro, debuting in 2014 vs Sri Lanka with frugal spells that choked runs and snatched scalps.

Her magic peaked with a record-shattering 5/15 — India's best-ever Women's World Cup figures — powering near-finals glory in 2017, plus Asian Games gold and 99 ODI wickets across 64 games, her flighted guile dismissing giants like Ellyse Perry. From consistent UP Warriorz campaigns (24 WPL wickets) to Test triumphs vs South Africa, Rajeshwari's quiet steel inspires: one looping delivery, born of relentless heart, can turn underdog tales into timeless victories.`,

  'Renuka Singh': `In the misty hills of Parsa village, Himachal Pradesh, three-year-old Renuka Singh lost her father — but her mother Sunita, a single parent toiling in the irrigation department, stitched cloth balls and wooden bats for her daughter's roadside games with boys, fueling a fire that would roar worldwide.

Spotting raw pace at 13, uncle Bhupinder sent her to Dharamshala academy; from there, Renuka exploded — debut T20I knuckle balls vs England (2021), 3 wickets in India's 2025 World Cup triumph (including key strikes vs South Africa), earning PM Modi's salute to her mother's sacrifices. Her Parsa homecoming feast revived village pride once won in tug-of-war; Renuka's swing proves one hill girl's grit, inked with her father's tattoo, lifts nations from rugged fields to glory.`,

  'Richa Ghosh': `In Siliguri's bustling lanes of West Bengal, a four-year-old Richa Ghosh picked up her first bat, fearlessly smashing sixes in local games — her explosive power-hitting and lightning glovework turning heads by age 16, when she exploded onto India's T20 World Cup squad in 2020.

Defying youth and pressure, she blazed the joint-fastest T20I fifty (vs West Indies, 2024), shattered records with 94 at No.8 vs South Africa in the 2025 World Cup (highest ever by a No.8 batter), and smashed winning runs for RCB's maiden WPL title — capped by honorary DSP status with West Bengal Police.

Richa's fire — from kid prodigy to all-format finisher with 1208 ODI runs and 38 sixes — inspires every dreamer: raw power, poise behind stumps, and unrelenting belief rewrite records and lift nations to glory.`,

  'Saika Ishaque': `In Kolkata's cramped Park Circus slums, where dreams battled daily hardship, young Saika Ishaque lost her father at 12 — yet channeled grief into left-arm spin mastery, bowling tirelessly on maidans to honor him, rising through Bengal domestics with quiet fire.

Her fairy-tale explosion came in WPL 2023: a debut 4/11 vs Delhi Capitals (dismissing Smriti Mandhana first up), finishing joint-second highest wicket-taker (9 scalps) as Mumbai Indians claimed inaugural glory — earning her T20I debut vs England that December. From shoulder injury comebacks to consistent MI trump card (30 lakhs retained for 2026), Saika's resilience whispers to slum kids everywhere: one probing spinner, fueled by loss and love, spins poverty into national pride.`,

  'Saima Thakor': `In Mumbai's bustling maidans, where football goals once called her name as a college goalkeeper, Saima Thakor traded posts for pace — honing right-arm seam and swing through relentless domestic battles for Mumbai since 2018, silencing skeptics with consistent hauls and gritty lower-order fight.

Her breakthrough roared in WPL 2024 with UP Warriorz (base price ₹10 lakh), blending tidy spells with batting cameos — then exploding internationally: ODI debut vs New Zealand (2 wickets, record 70-run 9th-wicket stand with Radha Yadav), T20I bow vs West Indies (snaring Qiana Joseph), and India A fire vs Australia A (3/31). Saima's journey — from multi-sport dreamer to seam-swing sensation — inspires: one persistent bowler from the city of dreams can swing her way to blues and beyond.`,

  'Sajeevan Sajana': `In Wayanad's rugged hills of Kerala, daughter of an auto-rickshaw driver, Sajeevan Sajana started with a plastic ball and coconut-frond bat — defying poverty and tribal odds as the second Kurichiya woman in WPL, her fire ignited at 17.

One magical swing changed everything: WPL 2024 debut last-ball six vs Delhi Capitals (needing 5 to win), catapulting Mumbai Indians to victory and earning her T20I cap vs Bangladesh — now a middle-order finisher (SR 154+), off-spin utility, and MI mainstay at ₹75 lakh.

From leading Kerala U23 to national glory, Sajana's raw power and poise roar to every underdog: humble tools forge World Cup dreams, one towering six at a time.`,

  'Sayali Satghare': `From Mumbai's Borivali streets, where street cricket with brothers sparked her fire, Sayali Satghare rose as a seam-bowling all-rounder — unsold in the 2025 WPL auction yet seizing every chance with gritty resolve.

Her phoenix moment: concussion sub for Gujarat Giants (WPL history's first), then RCB replacement for Ellyse Perry in 2026, exploding with 8 early wickets (Jemimah Rodrigues, Beth Mooney, Shafali Verma) — powering RCB's championship while claiming Alyssa Healy in her farewell Test at WACA (4/50 debut).

From net bowler to Test trailblazer and ODI debut vs Ireland, Sayali's comeback roar inspires: rejection fuels swing, persistence carves blues — one Borivali dreamer proving underdogs claim glory.`,

  'Shafali Verma': `In Rohtak's dusty lanes of Haryana, where her father Sanjeev — once a gully cricketer forced into a jewellery shop by family pressures — dressed 8-year-old Shafali Verma as a boy to sneak her into academies that shunned girls, her legend began. With brother Sahil bowling endlessly and dad carrying her to watch Sachin Tendulkar's final Ranji match, Shafali learned to hit hard and fearlessly — cutting her hair short, dominating U-12 boys' tournaments disguised as her sibling, and rising through sheer defiance despite failing Class X exams amid cricket's pull.

That unbreakable spirit exploded in the 2025 Women's World Cup final vs South Africa in Navi Mumbai: called in as injury replacement before the semis, the 21-year-old opener blazed 87 off 78 to propel India to 298/7, then stunned with 2/36 — her rare part-time spin snaring Marizanne Kapp and breaking partnerships — earning Player of the Match in a historic 52-run triumph, silencing drop critics with clutch magic.

From youngest T20I debutant (15 vs South Africa, 49 off 22) and India's first Test double-ton woman (205 vs South Africa) to Delhi Capitals' ₹2.2cr WPL storm (74 T20I sixes), Shafali's thunder — from gender barriers to World Cup redemption — inspires Haryana girls flocking to her family's door: one fearless blade, fueled by family dreams, shatters ceilings and lifts nations.`,

  'Shree Charani': `In the dusty playgrounds of Yeramala Palli village, Kadapa district, Andhra Pradesh, young Shree Charani — born to a modest family with her father Chandrasekhar Reddy toiling at the Rayalaseema Thermal Power Project — swapped plastic bats for real dreams, first excelling in kho-kho, badminton, and 3K runs before uncle Kishore Kumar Reddy ignited her cricket fire.

Defying poverty and skepticism, she begged coaches for "one more ball" in Hyderabad nets, honing left-arm spin with seam-like pace from a short run-up — exploding from Andhra U19 stardom (4-5 wickets routinely) to WPL's Delhi Capitals (₹55 lakh, 4 wickets in 2 games), then ODI/T20I debuts in 2025 vs Sri Lanka/England (Player of the Series: 10 wickets @14.80).

Her World Cup arc peaked as Kadapa's first India woman: clutch spells tightening India's 2025 title charge, blending accuracy, fitness, and power-hitting grit — proving one village girl's relentless hunger spins underdog tales into national gold.`,

  'Shreyanka Patil': `In Bangalore's sunlit nets at her father Rajesh's cricket academy, 10-year-old Shreyanka Patil chased her calling — dabbling in medium-pace and leg-spin before settling into off-spin mastery, leaving her rented Huttanahalli digs at dawn to captain Karnataka U-16s with infectious grit.

Disaster struck post-2024 T20 World Cup: Grade 3 shin splints sidelined her for months, followed by a wrist stress reaction, then a fractured thumb at India's bowlers' camp — 11 months of rehab tears, doubts about quitting, and isolation at the NCA, where she bonded with Suryakumar Yadav and journaled her way through Shane Watson mindset courses.

Unyielding, Shreyanka roared back in WCPL 2025 (Barbados Royals), starred for RCB in WPL 2026 (career-best 5/25 vs Gujarat Giants), and spun key wickets for India's campaigns — her phoenix fire proving rehab's darkness forges unbreakable spinners who lift trophies and nations.`,

  'Smriti Mandhana': `Picture a little girl in Sangli, Maharashtra, clutching a bat bigger than her dreams, tagging along with her older brother Shravan to practice. Smriti Mandhana wasn't born with a silver bat — she earned it, swinging endlessly while coaches scoffed at the "kid sister." By nine, she was dominating Maharashtra U-15s; by 11, U-19s; and at 17, she unleashed a stunning double century in a domestic U-19 match — the first by an Indian woman in List A cricket. Debuting for India at 16 in 2013, her elegant left-hand drives soon echoed across borders, with her maiden ODI hundred in Australia at 19 in 2016 marking her as the next big thing.

Then, darkness struck. In the 2017 Women's Big Bash League, a routine bowl shredded her left knee — torn ACL and meniscus. Crutches, surgery, brutal rehab. Most physios ruled her out of the home World Cup. Months blurred into pain, doubt whispering to quit.

But Smriti didn't break — she rebuilt. Against all odds, she raced back for the World Cup opener: 90 vs England, then an unbeaten 106 vs West Indies — two match-winning knocks with scant practice, igniting India's charge to the final. Injury had forged her steel.

From those ashes rose India's backbone. Consistent opener, vice-captain, WPL champion captain with Royal Challengers Bangalore, back-to-back ODI tons vs New Zealand, ICC rankings darling — she piled runs in WBBL, The Hundred, everywhere. Her graceful fury powered India's 2025 World Cup glory, proving one Sangli girl's grit doesn't just survive setbacks; it redefines eras.`,

  'Sneh Rana': `Imagine a girl from Almora's misty hills in Uttarakhand, dreaming big in a world that barely noticed women's cricket. Sneh Rana burst onto the scene at 19, debuting for India in 2014 with her teasing off-spin. But life had other plans — a brutal 2016 knee injury exiled her for five long years. Dropped, forgotten, whispers of "retire" echoing as she toiled alone in Railways nets, her fire flickering but never out.

Bristol, England. Test debut. The world watched as Sneh didn't just bowl — she rewrote her story. 4/110 ripping through England, then an unbeaten 80 from No.8 to defy follow-on and draw the match. From the wilderness, Sneh roared back — not as a rookie, but a warrior.

She faced more dragons. Dropped after 2023 T20WC semis, axed from white-ball sides for 18 months. Most would've quit. Sneh erupted instead — 15 wickets in 5 ODIs (Player of the Series, Sri Lanka tri-series), 5/40 vs South Africa, and CWG 2022 semis glory: defending 14 off the last over vs England, conceding just 9 for gold-medal triumph.

Her coronation? The 2025 World Cup — all-round fire, a 10-wicket Test haul vs South Africa, and WPL fireworks (26 off 6 balls, 3 sixes!). Each knockout, each scar, forged her mantra: knocked down seven times, rise eight. Sneh Rana didn't claim the throne — she earned it, spinning underdogs into legend, proving comebacks aren't luck — they're unbreakable will.`,

  'Tanuja Kanwar': `High in Shimla's cool hills, where pine-scented air meets rugged pitches, Tanuja Kanwar gripped her first ball as a left-arm orthodox artist, her natural flight turning heads in Himachal Pradesh youth ranks by age 15. A left-hand batter with deceptive control, she switched to Railways powerhouses, stacking domestic hauls: 140 List A wickets (best 6/10), 135 T20 scalps — her tidy economy choking run machines while sharp catches sealed games.

Gujarat Giants snagged her for WPL 2023 (23 wickets across seasons), but her international thunder roared in 2024: T20I debut vs UAE (Asia Cup Rising Stars), then ODIs vs West Indies — 2/31 economical spells proving composure under lights.

From Himachal's chill to global heat, Tanuja's quiet revolution — endless nets, unerring loop, lower-order grit — inspires hill girls: one Shimla arm can weave economy into legend, one catch at a time.`,

  'Tejal Hasabnis': `In Pune's sun-drenched maidans, Tejal Hasabnis learned cricket's quiet art — right-hand middle-order steel fused with right-arm off-breaks, stacking runs for Maharashtra and West Zone since her youth days.

Her golden streak ignited in 2024: three straight half-centuries vs Australia A (50, 63, 53), earning maiden India call-up vs New Zealand. Debut fireworks? 42 off 54 chasing 192 in Ahmedabad, steadying from 59/3 for a commanding victory. Followed by an unbeaten 53 off 46 vs Ireland in Rajkot — sixes sealing a six-wicket stroll and her first international fifty.

India A's ACC Women's Asia Cup Rising Stars champion (unbeaten 51 in the 2024 final vs Bangladesh A), Tejal's poise — composed chases and calm temperament under pressure — proves middle-order mettle: from Pune's patient grind to blue-jersey boss, one composed chase at a time.`,

  'Titas Sadhu': `In the humid heart of Chinsurah, West Bengal, where her father Ranadeep ran a modest cricket academy, a teenage Titas Sadhu — once a sprinting and swimming whiz who aced school with 93% — ditched the tracks for turf at 13. Rejected from state trials, she grinded harder, unleashing seam-swing fire that landed her in Bengal seniors at 16, the youngest ever.

Her star exploded in 2023: Player of the Match in the U19 T20 World Cup final with 2/6 vs England, clinching India's inaugural title (6 wickets tournament-wide). Asian Games gold followed — 3 wickets in the final vs Sri Lanka — then senior breakthroughs: T20I debut vs Bangladesh, ODIs vs West Indies, Delhi Capitals WPL squad.

Now with 13 T20I wickets at an average of 19 (best 4/17) and dreams of being "India's Bumrah," Titas' pace and poise — from academy reject to World Cup hero — inspires Bengal girls: swing with grit, and village dust turns to global thunder.`,

  'Uma Chetry': `In the remote bamboo groves of Kandulimari village, Golaghat district, Assam, Uma Chetry — born to a farmer father and homemaker mother — defied "boys' game" taunts, practicing with plastic balls alongside brothers, trekking miles to Golaghat Stadium under coach Dipen Chandra Roy.

Rising through Assam U-19s, she shone as India A's backup keeper: ACC Emerging Asia Cup 2023 triumph, Asian Games 2022 gold. A trailblazer at 22 — the first Northeast woman in India seniors — her T20I debut came in July 2024 vs South Africa, followed by an ODI debut in October 2025 vs Bangladesh as part of the historic World Cup-winning squad. UP Warriorz WPL replacement stints added further shine to her growing reputation.

Humble icon visiting schools, Uma's sharp glovework, right-hand grit, and Northeast pride roar to a generation: from village dust to World Cup medal, one fearless catch breaks barriers for Assam's daughters.`,

  'Vaishnavi Sharma': `In Gwalior's modest lanes, where her astrologer father Narendra Sharma foresaw a glittering future before she even gripped a ball, 5-year-old Vaishnavi Sharma dodged rough grounds with borrowed gear — bowling 30+ overs daily, her laser accuracy turning heads by age 11 in Madhya Pradesh U-16s.

Unsold at the WPL 2026 auction despite domestic dominance (21 wickets in Senior T20 Trophy), she channeled heartbreak into fire — dominating Under-23s. Fate struck: the 2025 U19 T20 World Cup's leading wicket-taker, India's first hat-trick there, clinching title retention. Weeks later came her maiden senior call-up vs Sri Lanka; T20I debut on December 21, 2025 (capped by Harmanpreet Kaur), snaring 5 series wickets including a best of 2/24 on placid decks.

From a "fated" prophecy to blue-jersey reality, Vaishnavi's control — praised by captains, inspired by Jadeja and Radha Yadav — proves stars align for those who bowl through disappointment: Gwalior's spinner, spinning dreams into international gold.`,

  'Yastika Bhatia': `In Vadodara's competitive nets, a karate black belt and multi-sport ace — excelling in swimming and badminton — Yastika Bhatia smashed her maiden ton at 17 for Baroda U19 (131 vs Maharashtra), her solid left-hand technique and glove work fast-tracking her to NCA camps by 2018.

Her debut tour of Australia in 2021 announced her arrival: 64 off 69 at No.3 in her third ODI, anchoring India's first 250+ chase to snap Australia's 26-ODI winning streak. An all-format capper (Test included), CWG silver medallist, and T20/ODI World Cup campaigner, she amassed 666 ODI runs across her career while becoming a Mumbai Indians WPL title-winner with her 360-degree flair.

From West Zone captaincy to a Melbourne Stars BBL stint, Yastika's poise — sharp glovework, 14 ODI catches, 10 stumpings — embodies Baroda grit: versatile firepower turning keeper challenges into game-changing cameos.`,
};

export default PLAYER_STORIES;
