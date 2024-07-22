import React from "react";

const page = () => {
return (
    <div className=" bg-pink-500 border-2 border-black px-10 ">
        <div>
            <div className=" ">
                <h1 className=" text-[6rem] uppercase  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                    <h1 className=" font-bold">Contact Us</h1>
                </h1>
            </div>
        </div>

        <div>
            <div>
               
                <div>
                    <p className=" text-lg  mt-4">
                        We’d love to hear from you! Whether you have a question about our products, need assistance with an order, or just want to share your feedback, our team is here to help.
                    </p>

                    <div className=" w-[30rem] h-[5rem]">
                <h2 className=" text-4xl font-bold uppercase  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                Get in Touch With Us
                </h2>
              </div>
                    <p className=" text-2xl  mt-4 font-bold" >You can reach us through the following methods:</p>

                    <div className=" w-[15rem] h-[5rem]">
                <h2 className=" text-4xl font-bold uppercase  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                Email
                </h2>
              </div>
                    <p className=" text-lg  mt-4">
                        For general inquiries, support, or feedback, please email us at <a href="mailto:support@purchasepal.com">support@purchasepal.com</a>.
                    </p>

                    <div className=" w-[15rem] h-[5rem]">
                <h2 className=" text-4xl font-bold uppercase  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                Phone
                </h2>
              </div>
                    <p className=" text-lg  mt-4">
                        Speak directly with our customer service team by calling us at <strong>1-800-123-4567</strong>. Our phone lines are open Monday to Friday, from 9:00 AM to 6:00 PM (EST).
                    </p>

                    <div className=" w-[15rem] h-[5rem]">
                <h2 className=" text-4xl font-bold uppercase  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                Live Chat
                </h2>
              </div>
                    <p className=" text-lg  mt-4">
                        For quick assistance, use our live chat feature available on our website. Click the chat icon at the bottom right corner to start a conversation with one of our representatives.
                    </p>

                    <div className=" w-[22rem] h-[5rem]">
                <h2 className=" text-4xl font-bold uppercase  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                Mailing Address
                </h2>
              </div>
                    <p className=" text-lg  mt-4">
                        If you prefer to send us a letter or return an item, please use the following address:
                    </p>
                    <address>
                        Purchase Pal
                        123 Shopping Street
                        E-commerce City, EC 12345
                        United States
                    </address>

                 
                
                    <div className=" mt-12 flex items-center flex-col">
                    <div className=" w-[30rem] h-[5rem]">
                <h2 className=" text-4xl font-bold uppercase  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
               Contact Form
                </h2>
                
              </div>
              <p  className=" text-lg  mt-4">
                        You can also use the contact form below to send us a message directly from our website:
                    </p>
                    </div>
                   
                    <div className=" mb-10">
                        <form className="mt-8">
                            <div className="flex flex-col items-center">
                                <div className=" flex ">
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        className=" w-64 p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none  mr-8"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        className="w-64 p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className="w-[34rem] p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
                                />
                             

                                <div className="">
                                    <textarea
                                        placeholder="Message"
                                        className="w-[34rem] h-[10rem] p-2 border-2 border-black bg-white text-black mt-4 flex self-center justify-center border-b-8 border-r-4  focus:outline-none "
                                    />
                                </div>

                                <div className=" h-[4rem]">
                                    <button className="w-80  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2  bg-green-500">
                                        <h1 className=" font-bold">Send Message </h1>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
};

export default page;
