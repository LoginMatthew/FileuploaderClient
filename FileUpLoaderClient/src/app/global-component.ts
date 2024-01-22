
export class GlobalComponent {
  public static appURL : string ='http://192.168.1.1:5003/';//an example ip address to run at home, you should rewrite the "app.module.ts" file the ip and port
  //public static appURL : string ='http://127.0.0.1:5003/';
  public static encrpytionKey : string = "abcdefghijklmnop";
  public static decrpytionKey : string = "abcdefghijklmnop";
  public static passwordMininumLength : number = 4;
  public static passwordMaximumLength : number = 12;
  public static clickTimeMinuteInteval : number = 5;
  public static checkTimeSecInterval : number = 1000;
}



