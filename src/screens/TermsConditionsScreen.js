import React from 'react';
import axios from 'axios';

import {
    StyleSheet,
    Alert,
    SafeAreaView,
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
import { Heading, } from '../components/Heading';
import { Error } from '../components/Error';
import { Success } from '../components/Success';
import { AuthContainer } from '../components/AuthContainer';
import { Loading } from '../components/Loading';
import { BASE_URL } from '../config';
// import { EmergencyAlarmModal } from '../components/EmergencyAlarmModal';
const { width, height } = Dimensions.get('window');
import FIcon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';


export function TermsConditionsScreen({ navigation }) {
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState('');
    const [loadMore, setLoadMore] = React.useState(false);
    const [isLoadMore, setIsLoadMore] = React.useState(false);


    return (
        <AuthContainer>
             <SafeAreaView
                    style={styles.mainView}>
            <ScrollView>
          
               
                  
                        <View style={styles.headerBG}>
                        <TouchableOpacity onPress={() => {
                                    navigation.goBack(null)
                                }}
                                    style={{margin: 10,flexDirection:'row',alignItems:'center'}} >
                                    <FIcon name="chevron-left" size={20}/>
                                    <Text style={{fontWeight: 'bold'}}>Back</Text>
                                </TouchableOpacity>
                            <Heading style={styles.titleText}>User Policy</Heading>
                            <Image source={require('../../Image/report.png')} style={styles.headerImage} />
                        </View>
                        <View style={styles.roudedLayout}>
                            <View style={styles.container}>
                                <Text style={styles.ParaMainTitle}>Data You Provide To Us</Text>
                                <Text style={styles.ParaText}>Welcome to Aptly Managed!</Text>
                                <Text style={styles.ParaText}>These terms and conditions outline the rules and regulations for the use of Aptly Managed's Website, located at www.aptlymanaged.com.</Text>
                                <Text style={styles.ParaText}>By accessing this website we assume you accept these terms and conditions. Do not continue to use Aptly Managed if you do not agree to take all of the terms and conditions stated on this page.</Text>
                                <Text style={styles.ParaText}>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalisation and/or he/she or they, are taken as interchangeable and therefore as referring to same.</Text>
                                <Text style={styles.ParaTitle}>Cookies</Text>
                                <Text style={styles.ParaText}>We employ the use of cookies. By accessing Aptly Managed, you agreed to use cookies in agreement with the Aptly Manageds Privacy Policy.</Text>
                                <Text style={styles.ParaText}>Most interactive websites use cookies to let us retrieve the user’s details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting  our website. Some of our affiliate/advertising partners may also use cookies. Have a look at our Cookie Policy in more detail.</Text>
                                <Text style={styles.ParaTitle}>License</Text>
                                <Text style={styles.ParaText}>Unless otherwise stated, Aptly Managed and/or its licensors own the intellectual property rights for all material on Aptly Managed. All intellectual property rights are reserved. You may access this from Aptly Managed for your own personal use subjected to restrictions set in these terms and conditions. Our Terms and Conditions were created with the help of the WebTerms Terms and Conditions Generator and the Privacy Policy Generator.</Text>
                                <Text style={styles.ParaText}>You must not:</Text>
                                <View style={styles.NoteListWrap}>
                                    <Text style={styles.NoteList}>• Republish material from Aptly Managed</Text>
                                    <Text style={styles.NoteList}>• Sell, rent or sub-license material from Aptly Managed</Text>
                                    <Text style={styles.NoteList}>• Reproduce, duplicate or copy material from Aptly Managed</Text>
                                    <Text style={styles.NoteList}>• Redistribute content from Aptly Managed</Text>
                                </View>
                                <Text style={styles.ParaText}>This Agreement shall begin on the date hereof.</Text>
                                <Text style={styles.ParaText}>Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Aptly Managed does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Aptly Managed,its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions. To the extent permitted by applicable laws, Aptly Managed shall not be liable for the Comments or for any liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of and/or appearance of the Comments on this website.</Text>
                                <Text style={styles.ParaText}>Aptly Managed reserves the right to monitor all Comments and to remove any Comments which can be considered inappropriate, offensive or causes breach of these Terms and Conditions.</Text>
                                <Text style={styles.ParaText}>You warrant and represent that:</Text>
                                <View style={styles.NoteListWrap}>
                                    <Text style={styles.NoteList}>• You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</Text>
                                    <Text style={styles.NoteList}>• The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;</Text>
                                    <Text style={styles.NoteList}>• The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy</Text>
                                    <Text style={styles.NoteList}>• The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity</Text>
                                </View>
                                <Text style={styles.ParaText}>You hereby grant Aptly Managed a non-exclusive license to use, reproduce, edit and authorize others to use, reproduce and edit any of your Comments in any and all forms, formats or media.</Text>
                                <Text style={styles.ParaTitle}>Hyperlinking to our Content</Text>
                                <Text style={styles.ParaText}>The following organizations may link to our Website without prior written approval:</Text>
                                <View style={styles.NoteListWrap}>
                                    <Text style={styles.NoteList}>• Government agencies;</Text>
                                    <Text style={styles.NoteList}>• Search engines;</Text>
                                    <Text style={styles.NoteList}>• News organizations;</Text>
                                    <Text style={styles.NoteList}>• Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</Text>
                                    <Text style={styles.NoteList}>• System wide Accredited Businesses except soliciting nonprofit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</Text>
                                </View>
                                <Text style={styles.ParaText}>These organizations may link to our home page, to publications or to other Website information so long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement or approval of the linking party and its products and/ or services; and (c) fits within the context of the linking party’s site. We may consider and approve other link requests from the following types of organizations:</Text>
                                <View style={styles.NoteListWrap}>
                                    <Text style={styles.NoteList}>• commonly-known consumer and/or business information sources;</Text>
                                    <Text style={styles.NoteList}>• dot.com community sites;</Text>
                                    <Text style={styles.NoteList}>• associations or other groups representing charities;</Text>
                                    <Text style={styles.NoteList}>• online directory distributors;</Text>
                                    <Text style={styles.NoteList}>• internet portals;</Text>
                                    <Text style={styles.NoteList}>• accounting, law and consulting firms; and</Text>
                                    <Text style={styles.NoteList}>• educational institutions and trade associations.</Text>
                                </View>
                                <Text style={styles.ParaText}>We will approve link requests from these organizations if we decide that: (a) the link would not make us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have  any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates the absence of Aptly Managed; and (d) the link is in the context of general resource information. These organizations may link to our home page so long as the link: (a) is not in any way deceptive; (b) does not falsely implysponsorship, endorsement or approval of the linking party and its products or services; and (c) fits within the context of the linking party’s site.</Text>
                                <Text style={styles.ParaText}>If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to Aptly Managed. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response.</Text>
                                <Text style={styles.ParaText}>Approved organizations may hyperlink to our Website as follows:</Text>
                                <View style={styles.NoteListWrap}>
                                    <Text style={styles.NoteList}>• By use of our corporate name; or</Text>
                                    <Text style={styles.NoteList}>• By use of the uniform resource locator being linked to; or</Text>
                                    <Text style={styles.NoteList}>• By use of any other description of our Website being linked to that makes sense within the context and format of content on the linking party’s site.</Text>

                                </View>
                                <Text style={styles.ParaText}>No use of Aptly Managed's logo or other artwork will be allowed for linking absent a trademark license agreement.</Text>
                                <Text style={styles.ParaTitle}>iFrames</Text>
                                <Text style={styles.ParaText}>Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.</Text>
                                <Text style={styles.ParaTitle}>Content Liability</Text>
                                <Text style={styles.ParaText}>We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or  which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.</Text>
                                <Text style={styles.ParaTitle}>Your Privacy</Text>
                                <Text style={styles.ParaText}>Please read Privacy Policy.</Text>
                                <Text style={styles.ParaTitle}>Reservation of Rights</Text>
                                <Text style={styles.ParaText}>We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it’s linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.</Text>
                                <Text style={styles.ParaTitle}>Removal of links from our website</Text>
                                <Text style={styles.ParaText}>If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.</Text>
                                <Text style={styles.ParaText}>We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.</Text>
                                <Text style={styles.ParaTitle}>Disclaimer</Text>
                                <Text style={styles.ParaText}>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:</Text>
                                <View style={styles.NoteListWrap}>
                                    <Text style={styles.NoteList}>• limit or exclude our or your liability for death or personal injury;</Text>
                                    <Text style={styles.NoteList}>• limit or exclude our or your liability for fraud or fraudulent misrepresentation;</Text>
                                    <Text style={styles.NoteList}>• limit any of our or your liabilities in any way that is not permitted under applicable law; or</Text>
                                    <Text style={styles.NoteList}>• exclude any of our or your liabilities that may not be excluded under applicable law.</Text>
                                </View>
                                <Text style={styles.ParaText}>The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.</Text>
                                <Text style={styles.ParaText}>As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature. </Text>
                                <Text style={styles.ParaText}>We are doing our best to prepare the content of this site. However, Aptly Managed cannot warranty the expressions and suggestions of the contents, as well as its accuracy. In addition, to the extent permitted by the law, Aptly Managed shall not be responsible for any losses and/or damages due to the usage of the information on our website. Our Disclaimer was generated with the help of the WebTerms Disclaimer Generator</Text>
                                <Text style={styles.ParaText}>By using our website, you hereby consent to our disclaimer and agree to its terms.</Text>
                                <Text style={styles.ParaText}>The links contained on our website may lead to external sites, which are provided for convenience only. Any information or statements that appeared in these sites are not sponsored, endorsed, or otherwise approved by Aptly Managed. For these external sites, Aptly Managed cannot be held liable for the availability of, or the content located on or through it. Plus, any losses or damages occurred from using these contents or theinternet generally.</Text>
                            </View>
                        </View>
                        {/* <EmergencyAlarmModal setLoading={setLoading} /> */}
             
                    <Loading loading={loading} />
               
            </ScrollView>
            </SafeAreaView>
        </AuthContainer>
    );
}

const styles = StyleSheet.create({
    mainView: {
        backgroundColor: '#FFF',
    },
    container: {
        paddingHorizontal: 15,
    },
    headerImage: {
        position: 'absolute',
        right: 20,
        top: 30,
        width: 100,
        height: 94,
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
