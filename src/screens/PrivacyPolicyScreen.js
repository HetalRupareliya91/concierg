import React from 'react';
import axios from 'axios';

import {
    StyleSheet,
    Alert,
    View,
    KeyboardAvoidingView,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
    ScrollView,
    RefreshControl,
    Dimensions,
} from 'react-native';
import {Heading} from '../components/Heading';
import {Error} from '../components/Error';
import {Success} from '../components/Success';
import {AuthContainer} from '../components/AuthContainer';
import {Loading} from '../components/Loading';
import {BASE_URL} from '../config';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Feather';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
export function PrivacyPolicyScreen({navigation}) {
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState('');
    const [loadMore, setLoadMore] = React.useState(false);
    const [isLoadMore, setIsLoadMore] = React.useState(false);
    const inset = useSafeAreaInsets()

    return (
        <AuthContainer>

            <SafeAreaView
                style={[styles.mainView,{paddingTop:inset.top}]}>
                <ScrollView>
                    <>
                        <View style={styles.headerBG}>
                            {/* <Image source={require('../../Image/Opps.png')} style={styles.headerImage}/> */}
                            <View>
                                <TouchableOpacity onPress={() => {
                                    navigation.goBack(null)
                                }}
                                    style={{margin: 10,flexDirection:'row',alignItems:'center'}} >
                                    <Icon name="chevron-left" size={20}/>
                                    <Text style={{fontWeight: 'bold'}}>Back</Text>
                                </TouchableOpacity>
                                <Heading style={styles.titleText}>Privacy Policy</Heading>
                            </View>
                            <Image source={require('../../Image/shield.png')} style={styles.headerImage} />
                        </View>
                        <View style={styles.roudedLayout}>
                            <View style={styles.container}>
                                <Text style={styles.ParaTitle}>Your Privacy Will Always Matter To Us</Text>
                                <Text style={styles.ParaText}>Aptly Managed mission is to ease the management of your property. Whether at home or away, you will be in control of the important things that really matter. Most importantly along with this mission is ensuring the data we collect about you, is used correctly and shared correctly. This Privacy Policy will apply when you use Aptly Managed. We will always offer user choices about the data we collect, use and share which is described within this Privacy Policy.</Text>
                                <Text style={styles.ParaTitle}>Introduction</Text>
                                <Text style={styles.ParaText}>Our users will share their identities, engage with their network, exchange knowledge, communicate with each other, post and view content on the message board, discover local services and take part in polls. This Privacy Policy applies to www.aptlymanaged.com and the mobile app Aptly Managed both on Android and Apple. </Text>
                                <Text style={styles.ParaTitle}>Change & Modifications</Text>
                                <Text style={styles.ParaText}>Aptly Managed is able to modify this Privacy Policy and if we make changes to it, we will make sure we let you know first through our service giving you the opportunity to review the changes we have made. If you do not agree with the changes we make, you will be given an option to close your account</Text>
                                <Text style={styles.ParaText}>You acknowledge that your continued use of our Services after we publish or send a notice about our changes to this Privacy Policy means that the collection, use and sharing of your personal data is subject to the updated Privacy Policy.</Text>
                                <Text style={styles.ParaMainTitle}>Data You Provide To Us</Text>
                                <Text style={styles.ParaTitle}>Registration</Text>
                                <Text style={styles.ParaText}>During registration with us you will need to provide data including your name and email address to your concierge or building management. They will create your account for you. Once created you will be emailed with your username and password and we advise the password is changed instantly so only you know and have access to this.</Text>
                                <Text style={styles.ParaTitle}>Profile</Text>
                                <Text style={styles.ParaText}>You have a choice about what information you want displayed on your profile, such as your Name and Photo, You don’t need to provide a photo if you don’t want to. However, having a profile picture will allow other users in your building to recognise you more effectively.</Text>
                                <Text style={styles.ParaText}>We do not require Members to include sensitive data (e.g.,race, ethnicity, political opinions, religious or philosophical beliefs, trade union membership, physical or mental health, sexual orientation or criminal record) in their profile. If you choose to post any such data, it is visible to others like the rest of the profile information you provide.</Text>
                                <Text style={styles.ParaText}>What you post on your profile is entirely up to you and to make that sensitive information public. Please do not post or add personal data to your profile that you would not want to be publicly available.</Text>
                                <Text style={styles.ParaTitle}>Partners</Text>
                                <Text style={styles.ParaText}>Our partners will receive personal data about you only if you choose to contact them through the discover page. They will only receive information if you choose to contact them, otherwise nothing will be sent to them</Text>
                                <Text style={styles.ParaTitle}>Service Use</Text>
                                <Text style={styles.ParaText}>We log usage data when you visit or otherwise use our Services, such as when you view or click on content or ads, perform a search, share articles or click on discover link. We use logins, cookies, device information and internet protocol (“IP”) addresses to identify you and log your use.</Text>
                                <Text style={styles.ParaTitle}>Data</Text>
                                <Text style={styles.ParaText}>We collect data through cookies and similar technologies.We receive data from your devices and networks, including location data.</Text>
                                <Text style={styles.ParaTitle}>Messages</Text>
                                <Text style={styles.ParaText}>If you communicate through our Services, we learn about that. We will be able to have access to all chat systems you have with your concierge and you will need to make sure you are respecting all other users on the platform. If you get reported you will get looked at. </Text>
                                <Text style={styles.ParaTitle}>Other</Text>
                                <Text style={styles.ParaText}>Our Services are dynamic, and we often introduce new features, which may require the collection of new information. If we collect materially different personal data or materially change how we use your data, we will notify you and may also modify this Privacy Policy.</Text>
                                <Text style={styles.ParaMainTitle}>How We Use Your Data</Text>
                                <Text style={styles.ParaTitle}>Stay Connected</Text>
                                <Text style={styles.ParaText}>Our Services allow you to stay in touch with other users on our platform, concierge and partners. You are able to chat with any concierge at ease. You can exchange professional thoughts and work together on our platform through the message board.</Text>
                                <Text style={styles.ParaText}>A user will be able to browse all profiles on the platform. The way the profiles are ranked will be from the like system. A performer can only like one person per day in each category. The more likes you have the higher you will appear in the search list. The way you can increase your likes is by winning competitions, applying to careers and by introducing more members to the site. Each user will be given a unique code that can be used only to gain access to the website. The platform is created so not everyone can just sign up easily but will need to be referred. This is set up to truly make sure that all the profiles we have on this platform are passionate about their career and growth and of a high quality standard.</Text>
                                <Text style={styles.ParaTitle}>Concierge & Loyalty</Text>
                                <Text style={styles.ParaText}>Online Live Chat: Direct contact with the concierge via the live chat feature. You will be able to communicate quickly and effectively about the building or apartment. Manage Visitors: The concierge will notify you of all visitors, contractors and deliveries connected with your apartment. Message Board: Up to date Information likely to impact your daily routine, such as local road and utility works or those frequent public events.Loyalty card: Discover the loyalty discounts available within your local area for restaurants, dentists, opticians and beauty services.</Text>
                                <Text style={styles.ParaTitle}>Your Apartment & Building</Text>
                                <Text style={styles.ParaText}>Apartment Info: Fingertip access to those vital home details soft furnishings, paint colours, measurements, equipment, light bulbs and the parking bay. Bills Management: All providers of your regular household and utilities bills in one place - even when to expect that bank balance hit. Building & Apartment Issues: Raise any issues you have with the building or your apartment - keep a track on its progress till resolution. Real Estate: Thoughts of selling, buying or renting... start with the ‘at a glance’ list of properties available on the in-house market.</Text>
                                <Text style={styles.ParaTitle}>Social Network</Text>
                                <Text style={styles.ParaText}>Community: The community place to advertise local activities, seek a football team, a tennis club or find that pub, cinema buddy or in-house babysitter. Polls: A very useful tool for all Leaseholders to cast their opinion, on a  matter which may effect what happens in the building. Services: Details of near by medical and dental services, pharmacy, estate agents, local authority and taxis... all in one place</Text>
                                <Text style={styles.ParaTitle}>Emergency & Notifications</Text>
                                <Text style={styles.ParaText}>Emergency Alert: In a building emergency, the concierge will issue an alert to apartments via the app and organise required assistance. Instant Contact: To get in touch directly with the concierge, just press the icon on the app. Your call will be connected instantly. Notifications: You will be notified of any messages, parcel deliveries and new properties on the market as well as latest loyalty discounts.</Text>
                                <Text style={styles.ParaTitle}>Communication</Text>
                                <Text style={styles.ParaText}>We will only contact you through our chat system or through email. We will not be contacting you via phone unless you have given us authorisation to do so.</Text>
                                <Text style={styles.ParaTitle}>Marketing</Text>
                                <Text style={styles.ParaText}>We use data and content about Residents for invitations and communications promoting partnerships and network growth, engagement and our services.</Text>
                                <Text style={styles.ParaTitle}>Developing Services and Research</Text>
                                <Text style={styles.ParaText}>We develop our services and will be conducting research. We use data, including public feedback, to conduct research and development for the further development of our Services in order to provide you and others with a better, more intuitive and personalised experience, drive membership growth and engagement on our Services, and help connect entertainers to each other and to create opportunity</Text>
                                <Text style={styles.ParaTitle}>Surveys</Text>
                                <Text style={styles.ParaText}>Polls and surveys are conducted by us and others through our Services. You are not obligated to respond to polls or surveys, and you have choices about the information you provide.</Text>
                                <Text style={styles.ParaTitle}>Customer Support</Text>
                                <Text style={styles.ParaText}>We use data to help you and fix problems. We use the data (which can include your communications) to investigate, respond to and resolve complaints and Service issues (e.g., bugs) as well as making sure we resolve any other complaints.</Text>
                                <Text style={styles.ParaTitle}>Security and Investigations</Text>
                                <Text style={styles.ParaText}>We will use data for security, fraud prevention and investigations.</Text>
                                <Text style={styles.ParaMainTitle}>How We Share Information</Text>
                                <Text style={styles.ParaTitle}>Our Services</Text>
                                <Text style={styles.ParaText}>Any data that you include on your profile and any content you post or social action (e.g. likes, comments, shares) you take on our Services will be seen by others. This is mainly in our Message Board as this is the place you are able to comment and share. We share your data across our Platform and selected partners if required. We may use others to help us with our Services.</Text>
                                <Text style={styles.ParaTitle}>Legal Disclosures</Text>
                                <Text style={styles.ParaText}>We may need to share your data when we believe it’s required by law or to help protect the rights and safety of you, us or others.</Text>
                                <Text style={styles.ParaMainTitle}>Your Choices and Obligations</Text>
                                <Text style={styles.ParaText}>We keep most of your personal data for as long as your account is open. You can access or delete your personal data. You have many choices about how your data is collected, used and shared.</Text>
                                <Text style={styles.ParaTitle}>Delete Data:</Text>
                                <Text style={styles.ParaText}>You can ask us to erase or delete all or some of your personal data (e.g., if it is no longer necessary to provide Services to you)</Text>
                                <Text style={styles.ParaTitle}>Change or Correct Data:</Text>
                                <Text style={styles.ParaText}>You can edit some of your personal data through your account. You can also ask us to change, update or fix your data in certain cases, particularly if it’s inaccurate.</Text>
                                <Text style={styles.ParaTitle}>Object to, or Limit or Restrict, Use of Data:</Text>
                                <Text style={styles.ParaText}>You can ask us to stop using all or some of your personal data (e.g., if we have no legal right to keep using it) or to limit our use of it (e.g., if your personal data is inaccurate or unlawfully held).</Text>
                                <Text style={styles.ParaTitle}>Right to Access and/or Take Your Data:</Text>
                                <Text style={styles.ParaText}>You can ask us for a copy of your personal data and can ask for a copy of personal data you provided in machine readable form.</Text>
                                <Text style={styles.ParaTitle}>Account Closer</Text>
                                <Text style={styles.ParaText}>If you choose to close your Aptly Managed account, your personal data will generally stop being visible to others on our Services within 24 hours. We generally delete closed account information within 30 days of account closure, except as noted below.</Text>
                                <Text style={styles.ParaText}>We retain your personal data even after you have closed your account if reasonably necessary to comply with our legal obligations (including law enforcement requests), meet regulatory requirements, resolve disputes, maintain security, prevent fraud and abuse, enforce our User Agreement, or fulfil your request to “unsubscribe” from further messages from us. We will retain de-personalised information after your account has been closed.</Text>
                                <Text style={styles.ParaText}>Information you have shared with others (e.g., through our messaging system or Forum) will remain visible after you closed your account or deleted the information from your own profile or mailbox, and we do not control data that other Members copied out of our Services. Groups content and ratings or review content associated with closed accounts will show an unknown user as the source. Your profile may continue to be displayed in the services of others (e.g., search engine results) until they refresh their cache.</Text>
                                <Text style={styles.ParaTitle}>Other Important Information Security</Text>
                                <Text style={styles.ParaText}>We implement security safeguards designed to protect your data, such as HTTPS. We regularly monitor our systems for possible vulnerabilities and attacks. However, we cannot warrant the security of any information that you send us. There is no guarantee that data may not be accessed, disclosed, altered, or destroyed by breach of any of our physical, technical, or managerial safeguards. We store and use your data outside your country.We have lawful bases to collect, use and share data about you. You have choices about our use of your data. At any time, you can withdraw consent by letting us know through email at info@aptlymanaged.com</Text>
                                <Text style={styles.ParaTitle}>Contact</Text>
                                <Text style={styles.ParaText}>You can contact us or use other options to resolve any complaints or any issues you may have with this Privacy Policy by using our contact form.</Text>
                            </View>
                        </View>
                    </>
                </ScrollView>
                <Loading loading={loading} />
            </SafeAreaView>

        </AuthContainer>
    );
}

const styles = StyleSheet.create({
    mainView: {
        backgroundColor: '#FFF',
        flex: 1
    },
    container: {
        paddingHorizontal: 15,
    },
    headerImage: {
        position: 'absolute',
        right: 20,
        top: 15,
        width: 90,
        height: 115,
    },
    roudedLayout: {
        marginTop: -36,
        paddingHorizontal: 15,
        paddingVertical: 30,
        backgroundColor: '#FFF',
        borderTopRightRadius: 36,
        borderTopLeftRadius: 36,
    },
    headerBG: {
        position: 'relative',
        height: 180,
        width: '100%',
        backgroundColor: '#EDB43C',
    },
    titleText: {
        position: 'absolute',
        top: 50,
        left: 0,
        color: '#000',
        fontSize: 22,
        textAlign: 'left',
    },
    ParaMainTitle: {
        marginBottom: 15,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    ParaTitle: {
        marginBottom: 15,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    ParaText: {
        marginBottom: 15,
        fontSize: 14,
        fontWeight: '400',
        color: '#333',
    }
});
