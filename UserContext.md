MockData 구성을 다시할께. 

 - MockDataDml FacilityStatusData.ts는 시설 현황에 들어가야 하는 정보로 구성.
 - 통합국 현황 정보는 제외함.
 - 기지국 중계기, WiFi, Femto는 아래의 구분으로 이루어짐.
 - 기지국
   * 기지국의 관리는 아래의 팀별로 관리하고 있음.
      - 중부본부: 충남Access운용팀, 충북Access운용팀
      - 서부본부: 전남Access운용팀, 전북Access운용팀, 제주Access운용팀.
   * 각 팀별 담당지역은 아래와 같음.
      - 충남Access운용팀: 충남, 대전, 세종
      - 충북Access운용팀: 충북
      - 전남Access운용팀: 전남
      - 전북Access운용팀: 전북
      - 제주Access운용팀: 제주
   * 기지국의 정보는 아래와 같이 구성됨.
      - 기지국 Site수
      - 기지국에서 운용중인 장비 Category별 갯수, 장비 Category는 크게 5G, LTE, WCDMA 및 LoRa로 구분됨.
      - 각 Category별 운용중인 장비수. Category별 운용장비 종류는 아래와 같음.
        . 5G
            . CDU10
            . CDU20_EL
            . CDU10외
            . CDU20_NK
            . CDU20_NK 외
            . DUH10
            . DUH20
            . DUH20외
        . LTE
            . DU20 내
            . DU20 외
            . DU20내 WL
            . DU25
            . DU30내
            . DU30내 WL
            . DU3외
            . DU35
            . ENB내
            . ENB외
            . 
        . WCDMA
            . E3내
            . E3내T
            . E3외
            . E3외T
            . E3R내
            . E3R내T
            . E3R외
            . E3R외T
            . ENB-ELG
            . FX
            . IPNB3S
            . IPNB6S
            . DBTS외
        . LoRa
            . LRGW
            . LRGWIB
            . LRGWREV
     - 운용 지역별로 5G, LTE, WCDMA 및 LoRa가 운용중이며, (5G, LTE, WCDMA는 거의 모든 지역에서 운용, (LTE>5G>WCDMA 순) LoRa는 일부 지역에서 운용중임 )
     - 장비 Category별로 운용지역별 종류는 다르게 구성되어 있음.

- 기지국
    * 광중계기 관리는 아래의 팀별로 관리하고 있음.
        - 중부본부: 충남Access운용팀, 충북Access운용팀
        - 서부본부: 전남Access운용팀, 전북Access운용팀, 제주Access운용팀.
    * 각 팀별 담당지역은 아래와 같음.
        - 충남Access운용팀: 충남, 대전, 세종
        - 충북Access운용팀: 충북
        - 전남Access운용팀: 전남
        - 전북Access운용팀: 전북
        - 제주Access운용팀: 제주
   * 광중계기 정보는 아래와 같이 구성됨.
        - 사이트 수
        - 사이트별 운용 장비 Category는 5G, LTE, WCDMA, 이동전화공통, WIBRO로 구성.
        - 각 Category별 장비 종류 및 현황은 다음과 같음.
            . 5G
                AAU10-3.5G-32T(NK)
                AAU10-3.5G-32T(SS)
                AAU11-3.5G-32T(NK)
                AAU20-3.5G-32T(EL)
                AAU20-3.5G-32T(NK)
                AAU20-3.5G-32T(SS)
                AAU20-3.5G-64T(EL)
                AAU20-3.5G-64T(NK)
                AAU20-3.5G-64T(SS)
                AAU21-3.5G-32T(SS)
                AAU21-3.5G-64T(NK)
                OPRU10-3.5G-4T(NK)
                PRU10-3.5G-4T(SS)
                PRU10-3.5G-8T(NK)
                PRU10-3.5G-8T(SS)
                PRU11-3.5G-8T(NK)
                PRU11-3.5G-8T(SS)
                RO-AAU(C)-3.5G-4T
                RO-AAU(C)-3.5G-4T-LSH310(NK)
                RO-AAU(W)-3.5G-4T
                RO-AAU(W)-3.5G-4T-LSH310(NK)
                RO-AAU-3.5G(B13)-4T-4475(ELG)
                RO-GIRO-D(0120)
                RO-GIRO-D(8020)
                RO-GIRO-D(8100)
                RO-GIRO-D(8100)-LSH310(NK)
                RO-GIRO-D(8100)-SLSH310(NK)
                RO-GIRO-D(8100)-SMHS(1C)
                RO-GIRO-DS(0120)
                RO-GIRO-DS(0120)-ILSH310(SS)
                RO-GIRO-DS(0120)-IMHS
                RO-GIRO-DS(0120)-LSH310(NK)
                RO-GIRO-DS(0120)-SMHS(1C)
                RO-GIRO-DS(01W0)
                RO-GIRO-DS(01W0)-LSH310(NK)
                RO-GIRO-DS(01W0)-LSH310(SS)
                RO-GIRO-DS(01W0)-SLSH310(NK)
                RO-GIRO-DS(01W0)-SMHS(1C)
                RO-GIRO-DS(8020)
                RO-GIRO-DS(8020)-IMHS
                RO-GIRO-DS(8020)-LSH310(SS)
                RO-GIRO-DS(80W0)
                RO-GIRO-DS(80W0)-2T
                RO-GIRO-DS(80W0)-2T-SMHS(1C)
                RO-GIRO-DS(80W0)-LSH310(SS)
                RO-GIRO-DS(80W0)-SMHS(1C)
                RO-GIRO-DS(8100)
                RO-GIRO-DS(8100)-2T
                RO-GIRO-DS(8100)-2T-LSH310(NK)
                RO-GIRO-DS(8100)-2T-SL310(NK)
                RO-GIRO-DS(8100)-2T-SMHS(1C)
                RO-GIRO-DS(8100)-ILSH310(NK)
                RO-GIRO-DS(8100)-IMHS
                RO-GIRO-DS(8100)-LSH310(NK)
                RO-GIRO-DS(8100)-LSH310(SS)
                RO-GIRO-DS(8100)-QMHS
                RO-GIRO-DS(8100)-SLSH310(NK)
                RO-GIRO-DS(8100)-SMHS(1C)
                RO-GIRO-DS(8120)-2T-SMHS(1C)
                RO-GIRO-DS(81W0)-2T-SMHS(1C)
                RO-GIRO-QS(8126)
                RO-GIRO-QS(8126)-2T
                RO-GIRO-QS(8126)-2T-SMHS(1C)
                RO-GIRO-QS(8126)-LSH310(NK)
                RO-GIRO-QS(8126)-LSH310(SS)
                RO-GIRO-QS(8126)-QMHS
                RO-GIRO-QS(8126)-SMHS(1C)
                RO-GIRO-QS(81W6)
                RO-GIRO-QS(81W6)-LSH310(NK)
                RO-GIRO-QS(81W6)-LSH310(SS)
                RO-GIRO-QS(81W6)-SMHS(1C)
                RO-GIRO-SS(0100)
                RO-GIRO-SS(0100)-2T
                RO-GIRO-SS(0100)-2T-SMHS(1C)
                RO-GIRO-SS(0100)-QMHS
                RO-GIRO-SS(0100)-SMHS(1C)
                RO-GIRO-SS(8000)
                RO-GIRO-SS(8000)-2T
                RO-GIRO-SS(8000)-2T-LSH310(NK)
                RO-GIRO-SS(8000)-2T-LSH310(SS)
                RO-GIRO-SS(8000)-2T-SMHS(1C)
                RO-GIRO-SS(8000)-LSH310(NK)
                RO-GIRO-SS(8000)-QMHS
                RO-GIRO-SS(8000)-SLSH310(NK)
                RO-GIRO-SS(8000)-SMHS(1C)
                RO-GIRO-T(8120)
                RO-GIRO-T(8120)-LSH310(SS)
                RO-GIRO-T(8120)-SMHS(1C)
                RO-GIRO-T(81W0)
                RO-GIRO-T(81W0)-IMHS
                RO-GIRO-T(81W0)-QMHS
                RO-GIRO-T(81W0)-SLSH310(NK)
                RO-GIRO-T(81W0)-SMHS(1C)
                RO-GIRO-TS(8106)
                RO-GIRO-TS(8106)-2T
                RO-GIRO-TS(8106)-LSH310(NK)
                RO-GIRO-TS(8106)-LSH310(SS)
                RO-GIRO-TS(8106)-SMHS(1C)
                RO-GIRO-TS(8120)
                RO-GIRO-TS(8120)-LSH310(NK)
                RO-GIRO-TS(8120)-SMHS(1C)
                RO-GIRO-TS(81W0)
                RO-GIRO-TS(81W0)-2T
                RO-GIRO-TS(81W0)-2T-LSH310(SS)
                RO-GIRO-TS(81W0)-LSH310(NK)
                RO-GIRO-TS(81W0)-LSH310(SS)
                RO-GIRO-TS(81W0)-QMHS
                RO-GIRO-TS(81W0)-SLSH310(NK)
                RO-GIRO-TS(81W0)-SMHS(1C)
                RO-GIRS-DS(8100)-2T
                RO-GIRS-DS(8100)-2T-SMHS(1C)
                RO-PRU-3.5G-2T
                RO-PRU-3.5G-2T-LSH310(NK)
                RO-PRU-3.5G-4T
                RO-PRU-3.5G-4T-LSH310(NK)
                RO-PRU-3.5G-4T-LSH310(SS)
                T_RO-PRU-3.5G-4T-LSH310(NK)
            . LTE
                ARRU_L(SS)
                ARRU_WL(SS)
                CRU_L10(NSN)
                CRU_L10(SS)
                DBRRU(SS)
                DBRRU(SS)-WL
                ICS-L1.8-20
                MIBOS-D-L60_TNL
                MIMO-1CA
                RF정합장치_FRGX(NSN)
                RO-GIRO-QS(8126)-SMHS(1C)
                RO-GIRO-SS(8000)-2T
                RO-GIRO-SS(8000)-2T-SMHS(1C)
                RO-IRO-D(0120)
                RO-IRO-D(0120)-IMHS
                RO-IRO-D(0120)-QMHS
                RO-IRO-D(0120)-SMHS(1C)
                RO-IRO-D(0120)-SMHS(2C)
                RO-IRO-D(0120)-SMHS(3C)
                RO-IRO-D(01W0)
                RO-IRO-D(80W0)
                RO-IRO-D(80W0)-IMHS
                RO-IRO-D(8100)
                RO-IRO-D(8100)-IMHS
                RO-IRO-D(8100)-QMHS
                RO-IRO-D(8100)-SMHS(1C)
                RO-IRO-DS(0120)
                RO-IRO-DS(0120)-IMHS
                RO-IRO-DS(0120)-QMHS
                RO-IRO-DS(0120)-SMHS(1C)
                RO-IRO-DS(0120)-SMHS(3C)
                RO-IRO-DS(01W0)
                RO-IRO-DS(01W0)-QMHS
                RO-IRO-DS(01W0)-SMHS(1C)
                RO-IRO-DS(8020)
                RO-IRO-DS(8020)-IMHS
                RO-IRO-DS(8020)-QMHS
                RO-IRO-DS(8020)-SMHS(1C)
                RO-IRO-DS(80W0)
                RO-IRO-DS(80W0)-IMHS
                RO-IRO-DS(80W0)-SMHS(1C)
                RO-IRO-DS(8100)
                RO-IRO-DS(8100)-IMHS
                RO-IRO-DS(8100)-QMHS
                RO-IRO-DS(8100)-SMHS(1C)
                RO-IRO-Q(8126)
                RO-IRO-Q(8126)-IMHS
                RO-IRO-Q(8126)-SMHS(1C)
                RO-IRO-Q(8126)-SMHS(2C)
                RO-IRO-Q(8126)-SMHS(3C)
                RO-IRO-Q(81W6)
                RO-IRO-Q(81W6)-IMHS
                RO-IRO-Q(81W6)-SMHS(1C)
                RO-IRO-Q(81W6)-SMHS(2C)
                RO-IRO-Q(81W6)-SMHS(3C)
                RO-IRO-QS(8126)
                RO-IRO-QS(8126)-IMHS
                RO-IRO-QS(8126)-SMHS(2C)
                RO-IRO-QS(81W6)
                RO-IRO-QS(81W6)-IMHS
                RO-IRO-QS(81W6)-SMHS(1C)
                RO-IRO-QS(81W6)-SMHS(2C)
                RO-IRO-QS(81W6)-SMHS(3C)
                RO-IRO-S(0100)
                RO-IRO-S(0100)-IMHS
                RO-IRO-S(0100)-QMHS
                RO-IRO-S(0100)-SMHS(1C)
                RO-IRO-S(0100)-SMHS(2C)
                RO-IRO-S(8000)
                RO-IRO-S(8000)-QMHS
                RO-IRO-S(8000)-SMHS(1C)
                RO-IRO-SLIM-Q(81W6)-SMHS(1C)
                RO-IRO-SS(0020)
                RO-IRO-SS(0020)-QMHS
                RO-IRO-SS(0020)-SMHS(1C)
                RO-IRO-SS(0100)
                RO-IRO-SS(0100)-QMHS
                RO-IRO-SS(0100)-SMHS(1C)
                RO-IRO-SS(8000)
                RO-IRO-SS(8000)-QMHS
                RO-IRO-SS(8000)-SMHS(1C)
                RO-IRO-T(01W6)
                RO-IRO-T(01W6)-IMHS
                RO-IRO-T(01W6)-SMHS(1C)
                RO-IRO-T(01W6)-SMHS(2C)
                RO-IRO-T(8026)
                RO-IRO-T(80W6)
                RO-IRO-T(80W6)-IMHS
                RO-IRO-T(80W6)-SMHS(1C)
                RO-IRO-T(80W6)-SMHS(3C)
                RO-IRO-T(8106)
                RO-IRO-T(8106)-IMHS
                RO-IRO-T(8106)-SMHS(1C)
                RO-IRO-T(8120)
                RO-IRO-T(8120)-IMHS
                RO-IRO-T(8120)-QMHS
                RO-IRO-T(8120)-SMHS(1C)
                RO-IRO-T(8120)-SMHS(2C)
                RO-IRO-T(8120)-SMHS(3C)
                RO-IRO-T(8126)-SMHS(1C)
                RO-IRO-T(8126)-SMHS(3C)
                RO-IRO-T(81W0)
                RO-IRO-T(81W0)-IMHS
                RO-IRO-T(81W0)-QMHS
                RO-IRO-T(81W0)-SMHS(1C)
                RO-IRO-T(81W0)-SMHS(2C)
                RO-IRO-T(81W0)-SMHS(3C)
                RO-IRO-T(81W6)-SMHS(1C)
                RO-IRO-TS(01W6)
                RO-IRO-TS(01W6)-IMHS
                RO-IRO-TS(8026)
                RO-IRO-TS(80W6)
                RO-IRO-TS(80W6)-IMHS
                RO-IRO-TS(80W6)-SMHS(3C)
                RO-IRO-TS(8106)
                RO-IRO-TS(8106)-IMHS
                RO-IRO-TS(8120)
                RO-IRO-TS(8120)-IMHS
                RO-IRO-TS(8120)-SMHS(1C)
                RO-IRO-TS(8120)-SMHS(2C)
                RO-IRO-TS(8120)-SMHS(3C)
                RO-IRO-TS(81W0)
                RO-IRO-TS(81W0)-IMHS
                RO-IRO-TS(81W0)-SMHS(1C)
                RO-IRO_SLIM-Q(81W6)
                RO-IRO_SLIM-Q(81W6)-IMHS
                RO-MBS-CL-L60-SMHS-1C
                RO-MBS-L-L20-SMHS-1C
                RO-MBS-Q-L60-SMHS-3C
                RO-MBS-T-L60-SMHS-1C
                RO-MBS-T-L60-SMHS-2C
                RO-MBS-T-L60/AD-L60-SMHS-1C
                RO-MBS-T-L60/AD-L60-SMHS-2C
                RO-MBS-TS-L60-SMHS-1C
                RO-MBS-TS-L60-SMHS-3C
                RO-MIBOS-AD-L0
                RO-MIBOS-AD-L0(2.6)
                RO-MIBOS-AD-L0(2.6)-AMHS
                RO-MIBOS-AD-L0(2.6)-SMHS(1C)
                RO-MIBOS-AD-L60
                RO-MIBOS-AD-L60-AMHS
                RO-MIBOS-AD-L60-SMHS(1C)
                RO-MIBOS-AD-L60-SMHS(2C)
                RO-MIBOS-AD-L60-SMHS(3C)
                RO-MIBOS-CL-L0
                RO-MIBOS-CL-L0-QMHS
                RO-MIBOS-CL-L60
                RO-MIBOS-CL-L60-QMHS
                RO-MIBOS-D-L0
                RO-MIBOS-D-L0-QMHS
                RO-MIBOS-D-L60
                RO-MIBOS-D-L60-QMHS
                RO-MIBOS-D-L60-SMHS(1C)
                RO-MIBOS-D-L60-SMHS(2C)
                RO-MIBOS-DS(1.8/W)
                RO-MIBOS-DS(1.8/W)-QMHS
                RO-MIBOS-L-L20
                RO-MIBOS-L-L20-QMHS
                RO-MIBOS-L60
                RO-MIBOS-Q-L60
                RO-MIBOS-Q-L60-QMHS
                RO-MIBOS-T(C)-L60
                RO-MIBOS-T(C)-L60-QMHS
                RO-MIBOS-T-L0
                RO-MIBOS-T-L0-QMHS
                RO-MIBOS-T-L60
                RO-MIBOS-T-L60-QMHS
                RO-MIBOS-T-SMHS(1C)
                RO-MIBOS-T-SMHS(3C)
                RO-MIBOS-TS-L60
                RO-MIBOS-TS-L60-QMHS
                RO-MIBOS-TSR(2.6)-L60
                RO-MIBOS-TSR(2.6)-L60-QMHS
                RO-MIBOS-WL(ME)-L05
                RO-MIBOS-WL(ME)-L05-QMHS
                RO-MIBOS-WL-L0
                RO-MIBOS-WL-L0-QMHS
                RO-MIBOS-WL-L10
                RO-MIBOS-WL-L10-QMHS
                RRH_L(LGE)
                RRH_L(NSN)
                RRU(0100)_R4471(ELG)
                RRU(0120)_AHEGA(NSN)
                RRU(0120)_AHEGA(NSN)-WL
                RRU(0126)_R4466(ELG)
                RRU(SS)
                RRUS13(ELG)
                RRU_1.8G_FHEA(NSN)
                RRU_2.6G_ARRU(SS)
                RRU_2.6G_FRHG(NSN)
                RRU_2.6G_R2212(ELG)
                RRU_800M_AHCA(NSN)
                RRU_800M_AHCG(NSN)
                RRU_800M_R2212(ELG)
                RRU_800M_R2271(ELG)
                RRU_800M_RF2235(SS)
                RRU_FHEB(NSN)
                RRU_FRGT(NSN)
                RRU_FRGT(NSN)-WL
                RRU_L(SS)
                RU(NSN)
                RU_FXEB(NSN)
                SRRU(SS)
                SRRU_D(SS)
            . WCDMA
                A8+
                CMW-DUO
                CMW-DUO20
                DDR-DUON5_IBS
                DDR-W-D60_IBS
                DUO-IBS
                DUO-IBS_U
                DUO-METRO
                ERRHS
                ERRUP
                ERRUS
                ICS-DUO
                ICS-DUOC
                ICS-W20
                ICS-W5
                ICS-WN20
                ICS-WN5
                LR-DUO
                LR-DUO2
                LR-DUO5
                LR-DUON5
                LR-DUONC5
                LR-DUOR2
                LR-DUOR5
                MMW-DUO2/5
                MPR-DUO
                MPR-DUON20
                MPR-DUON20_IBS
                MPR-DUON5
                MPR-WN20
                MPR-WN5
                MW-DUO
                OMW-DUO
                OMW-DUO20
                OR-DUO2
                OR-DUO5
                OR-DUON5
                OR-DUOR2
                OR-DUOR5
                OR-DUORC6
                OR-W6
                OTTA-W20
                OTTA-W30
                OTTA-WN20
                RAU-DUO5
                RAU-DUON5
                RAU-DUON6
                RAU-DUONC5
                RAU-W2
                RHU-DUO0520
                RHU-DUO0520-CMHU
                RHU-DUO0520-MHU
                RHU-DUO0520-OMHU
                RHU-DUO0530
                RHU-DUO0530-OMHU
                RHU-DUO20
                RHU-DUO20-MHU
                RHU-DUO20-OMHU
                RHU-DUO5
                RHU-DUO5-MHU
                RHU-DUO5-OMHU
                RHU-DUOC0520
                RHU-DUOC0520-CMHU
                RHU-DUOC0520-MHU
                RHU-DUOC0520-OMHU
                RHU-DUOC0530
                RHU-DUOC0530-OMHU
                RHU-DUOC20-OMHU
                RHU-DUOC5-OMHU
                RHU-DUOFC30-OMHU
                RHU-DUOFC6-OMHU
                RHU-DUON20
                RHU-DUON20-CMHU
                RHU-DUON20-MHU
                RHU-DUON20-OMHU
                RHU-DUON5
                RHU-DUON5-CMHU
                RHU-DUON5-MHU
                RHU-DUON5-OMHU
                RHU-DUONC20
                RHU-DUONC20-CMHU
                RHU-DUONC20-MHU
                RHU-DUONC20-OMHU
                RHU-DUONC5
                RHU-DUONC5-CMHU
                RHU-DUONC5-MHU
                RHU-DUONC5-OMHU
                RHU-DUONC6
                RHU-DUONC6-OMHU
                RHU-W2
                RHU-W2-MHU
                RHU-WF30
                RHU-WF30-MHU
                RHU-WF30-OMHU
                RHU-WF6
                RHU-WF6-MHU
                RHU-WN20
                RHU-WN20-MHU
                RHU-WN20-OMHU
                RHU-WN30
                RHU-WN30-OMHU
                RHU-WN5
                RHU-WN5-MHU
                RHU-WN5-OMHU
                RMW-DUO
                RMW-DUO20
                RMW-DUO_L
                RO-DUO-AA020
                RO-DUO-AA020-CMHU
                RO-DUO-AA2020
                RO-DUO-AA2020-CMHU
                RO-DUO-AA2030
                RO-DUO-AA2030-CMHU
                RO-DUOC-AA2020-CMHU
                RO-DUON5
                RO-DUON5-MHU
                RO-DUON5-MOU
                RO-DUON5-OMHU
                RO-DUONC5
                RO-DUONC5-MOU
                RO-IRO-Q(8126)
                RO-IRO-Q(8126)-IMHS
                RO-IRO-Q(8126)-SMHS(1C)
                RO-IRO-Q(81W6)
                RO-IRO-QS(8126)
                RO-IRO-QS(8126)-IMHS
                RO-IRO-T(8106)
                RO-IRO-TS(8106)
                RO-IRO-TS(8106)-IMHS
                RO-IRO_SLIM-Q(81W6)
                RO-MBS-Q-L60-SMHS-3C
                RO-MBS-T-L60-SMHS-1C
                RO-MBS-T-L60-SMHS-2C
                RO-MBS-T-L60-SMHS-3C
                RO-MIBOS-Q-L60
                RO-MIBOS-Q-L60-QMHS
                RO-MIBOS-T-L0
                RO-MIBOS-T-L0-QMHS
                RO-MIBOS-T-L60
                RO-MIBOS-T-L60-QMHS
                RO-MIBOS-TS-L60
                RO-MIBOS-TS-L60-QMHS
                RO-MIBOS-WL(ME)-L05
                RO-MIBOS-WL(ME)-L05-QMHS
                RO-MIBOS-WL-L0
                RO-MIBOS-WL-L0-QMHS
                RO-MIBOS-WL-L10
                RO-MIBOS-WL-L10-QMHS
                RO-STORM-000-H2-SMHS#2
                RO-STORM-230-H2-SMHS#2
                RO-STORM-232-H2-SMHS#2
                RO-TM-DAA063-CMHU
                RO-TM-DAA460-CMHU
                RO-TM-DAA463
                RO-TM-DAA463-CMHU
                RO-W-D60
                RO-W-D60-CMHU
                RRH
                RRU
                SF-DUO
                SF-DUO20
                SF-DUOR
                SF-DUOR20
                SF-T
                SF-T023
                SF-T423
                SF-TM023
                SF-TM423
                SF-TMN423
                SF-W15
                SF-W20
                SF-WIM23
                SF-WIM43
                SF-WN20
                SF-WR15
                SF-WR20
                SRF-C20
                SRF-W15
                SRF-W20
                TOS-W15
                TTA-W20
                TTA-W30
                TTA-W40
                WAFMCA
                WAFMCB
                WINS(+)
                지하철광분산
            . WIBRO
                RO-MIBOS-Q-L60
                RO-TM-DAA463
                SF-T
                SF-TM023
                SF-WIM23
            . 이동전화 공통
                DUO-IBS
                ICS-W1
                LR-DUO
                LR-DUO2
                OMW-DUO20
                OR-DUO2
                OR-DUOR2
                RAU-DUOC5
                RHU-DUON20
                RHU-DUON20-MHU
                RHU-DUON20-OMHU
                RHU-DUON5
                RHU-DUON5-OMHU
                RHU-DUONC5-MHU
                RHU-DUONC5-OMHU
                RO-DUO-AA2020
                RO-DUO-AA2020-CMHU
                RO-DUON5-MOU
                RO-W-D60-CMHU
                SF-DUO
                SF-DUO20
        - 운용 지역별로 5G, LTE, WCDMA 등의 Category 별로 운용중이며, (5G, LTE, WCDMA는 거의 모든 지역에서 운용). 장비 Category별로 운용지역별 종류는 다르게 구성되어 있음. 
 


기지국 현황 페이지와 유사한 형태로 중계기 현황 페이지도 구성할꺼야. 
  - facilityStatusData.ts에서 광중계기와 관련된 데이터를 활용해서 페이지 구성을 해줘.
  - KPI 및 Drill Down 형태도 유사하게 구성해줘.

안전페이지의 KPI는 아래의 4개 항목으로 구분해줘.
 - 고위험 작업 현황
     . 당일/주간 수로 표현
     . 고위험은 C3이상 항목에 대해 구성         . 
 - 야간 작업 현황
    . 당일/주간 수로 표현    
 - 원거리 작업
    . 당일/주간 수로 표현
    . 원거리의 기준: 
      . 중부(충북Access운용팀 제외)의 경우 대전, 세종, 계룡, 공주, 금산, 논산을 제외한 나머지 지역
      . 중부의 충북Access운용팀은 보은, 영동, 옥천, 음성, 증평, 진천, 청주를 제외한 나머지 지역
      . 서부의 제주는 모두 근거리.
      . 서부의 전북Access운용팀은 전주시, 완주군을 제외한 나머지 지역
      . 서부의 나머지 팀은 광주광역시, 나주시, 담양군, 영광군, 장성군, 함평군, 화순군을 제외한 나머지 지역
      . 애매한 정보는 모두 근거리로 표현
 - 사옥작업 현황
    . 당일/주간 수로 표현
    . 작업명에 사옥명(둔산사옥, 둔산구사옥, 청주사옥, 부암사옥, 우산사옥, 송정사옥, 제주사옥, 전주사옥)이 포함되는 작업항목,


팀별 작업 현황 Section을 아래와 같이 수정해줘.
  - 팀별 작업 현황 --> 주간 작업 현황
  - 아래의 항목을 도넛 형태의 그래프로 구현
    . 고위험/일반
    . 주간/야간
    . 근거리/원거리
  - 팀별 현황 표는 안전코드별 현황 섹션에 넣어줘.
  - 분류별 현황은 유지해줘.


KPI Drill Down으로 Sidebar In 형태를 구성할꺼야.
  - 고위험 작업 현황의 경우 금일자 고위험 작업에 대한 작업명, 지역, 분류, 담당팀 및 주/야간 항목 표현해줘.
  - 야간 작업 현황의 경우 금일자 야간 작업에 대한 작업명, 지역, 분류, 담당팀 표현해줘.
  - 원거리 작업 현황의 경우 금일자 원거리 작업에 대한 작업명, 지역, 분류, 담당팀 및 주/야간 항목 표현해줘.
  - 사옥 작업 현황의 경우 금일자 사옥 작업에 대한 작업명, 지역, 분류, 담당팀 및 주/야간 항목 표현해줘.


Home 구성

--------------------------------------------------------------------------
|                                               |                         |
|                                               |     안정 요약             |
|                                               |-------------------------|
|                                               |                         |
|                                               |    안전/보안 요약          |
|             품질 요약 정보                        |-------------------------|
|                                               |                         |
|                                               |    CapEx 요약            |
|                                               |-------------------------|
|                                               |   OpEx 요약              |
|                                               |                         |
|                                               |-------------------------|
|                                               |   이슈사항                |
|                                               |                         |
--------------------------------------------------------------------------
  - 품질 요약 관련된 정보는 첨부의 그림과 유사한 형태로 구성
  - 안정, 안전/보안, CapEx, OpEx 및 이슈사항에 대해서는 추후 작성, 해당 항목에 들어가기 위한 Layout만 구성.
  
Home부분에 들어가는 페이지에 대해 아래와 같이 구성했어. 각 파일은 구성되어 있고 해당 파일은 포털에 추가해서 구성해줘.(App.tsx 수정 필요)

homeMockData.ts
│
├── cqPrev / cqToday          → HomeQualityPanel (CQ 바 차트)
├── endcPrev / endcToday      → HomeQualityPanel (ENDC 파이차트)
├── cqDayTrend* / cqHourTrend* → HomeTrendChart (라인차트)
├── safetySummary             → HomeSafetyPanel (당일/주간 카드)
├── stabilitySummary          → HomeStabilityPanel (상태 카드)
├── capexSummary + capexMeta  → BudgetPanel (CapEx)
├── opexSummary + opexMeta    → BudgetPanel (OpEx)
└── issueList                 → HomeIssuePanel (이슈 목록)
         │
         ▼
    HomePage.tsx  (데이터 주입 허브)
         │
         ▼
    App.tsx  (level1 === "home" 라우팅)


현재 구성된 페이지에 대해 아래의 내용을 수정해줘.
  - 품질 등급에 대한 내용과 요약 Card Section 부분의 세로 크기가 동일하도록 구성
  - MockData가 중부/서부가 다르게 구성
  - CQ 품질변화 추이 상단에 Map 구성 Map에 구성되는 정보는 아래와 같음
    . 중부 본부(대전, 세종, 충남, 충북 지역) 관리하는 지역의 현재 품질 현황, 시군구 기준으로 영역별 생상 또는 영역편 % 표현
    . 서부 본부(전남, 전북, 제주 지역) 관리하는 지역의 현재  품질 현황, 시군구 기준으로 영역별 생상 또는 영역편 % 표현
    . 필요시 MockData구성, 
    . Map은 Kakao Map 사용(확대/축소 가능하도록 Map 구성)
  - 요약 관련 Card Section의 위치 조절
    . 안정,
    . 안전/보안
    . CapEx
    . OpEx
    . Isseu
  - 전체 Layout이 잘 정리될 수 있도록 크기 조절
  
  home Layout 구성시 품질등급 요약이라는 Tilte로 품질 섹션과 요약 섹션의 위치 정렬이 안되니 아래와 같은 방향으로 수정해줘.
    - 요약 섹션에 "주요 지표" 타이틀 생성
    - 품질 등급 요약 하위에 구성된 기준 시점을 "품질등금요약" 타이틀 우측에 ()안에 표현 - 글자크기 조절
    - CQ 등급과 ENDC 시도호 그래프 크기 조절
      . 도넛 차트에서 파이차트로 변경, Legend는 우측에 표현될 수 있도록 크기 조절 (CQ 등급 그래프에서 여백 생성, ENDC 가로크기를 늘리는 방향으로 조절)
    - Map 우측에 시도별 항목이 표현될 수 있도로 구성(현재는 Map 아래쪽에 구성)

하기 내용 수정해줘.
  - ENDC 시도호의 경우 두개의 그래프가 수직정렬이 아닌 수평정렬로 표현되게 구성.
  - 시군구 품질 현황
     . 지도 안나옴. 지도 설정 검토.
     . 시도별 %율을 Worst 5개만 표시
  - 전체 크기를 1920 x 1080에 맞출수 있도록 크기 조절

CQ 4등급 이하의 Card 섹션, 그리고 시군구 현황에서의 worst 5 항목을 선택할 경우 Sidebar In 형태로 세부 내용을 표출할꺼야. 세부 내용은 동일하고, 내용은 내가 채울께. 해당 항목을 선택했을때 Side In이 뜰 수 있도록 구성해줘.


안전 작업 요약 항목을 아래와 같이 수정해줘.
  - 안전 작업의 경우 작업 안전과 보안으로 분류되어 있어.
  - 작업 안전의 경우 현재 표현된 고위험, 야간, 원거리 및 사옥에 대한 당일항목수/주간항목수 로 표현해줘.
    . 현재 구성된 위험, 주의, 정상 Badge는 삭제
    . 4개의 항목을 수평정렬로 표현
  - 보안의 경우 추후 유사하게 4개의 항목을 선정하여 표현할꺼야.
  
주요 지표의 카드 선택시 아래와 같이 연결되게 수정해줘.
  - 안정 - 현황>안정 페이지
  - 안전/보안 - 현황>안전>작업 페이지
  - CapEx 집행 - 지표>CapEx 페이지
  - OpEx 집행 - 지표> OpEx 페이지

시군구별 품질 현황 항목을 아래와 같이 수정해줘.
  - 초기 접근시 5개의 항목 위치가 나타나도록 Map의 Zoom Level 구성
  - 항목 선택시 해당 항목에 대한 시/군/구 위치가 나타날 수 있도록 Zoom Level 및 위치 조정


CQ 품질 변화 추이 그래프에서 아래 사항을 더 넣어줘. 추가되는 항목에 대한 MockData도 같이 구성해줘.
  - Reference Target으로 전국 현황에 대한 그래프 추가해줘.
  - 현재 구성된 항목은 중부본부 또는 서부 본부 전체에 대한 내용이야.
    . 중부본부는 광역시도 기준으로(대전, 세종, 충남, 충북, KTX)으로 구분하여 볼수 있게 구성해줘. 해당 항목 전체를 그래프로 표현하는 건 아니고, 선택된 항목만 표현되게(전체, 대전, 세종, 충남, 충북) 구성해줘.
    . 서부 본부는 광역시도 기준으로(전남, 전북, 제주 및 도서지역)으로 구분하여 볼수 있게 구성해줘. 해당 항목 전체를 그래프로 표현하는 건 아니고, 선택된 항목만 표현되게(전체, 전남, 전북, 제주, KTX 및 도서지역) 구성해줘.

보안 페이지에서 사용할 수 있는 MockData를 구성하려고 해.
 - 보안 페이지도 서부 본부와 중부 본부로 나누어 구성 필요.
 - 페이지에서 기본적으로 나와야 하는 정보는 아래와 같아.
   . 서버 보안 (중부 본부 총 120대, 서부 본부 총 430대 수준으로 정의)   
      . 보안 조치 현황(조치 완료 대수로 MockData 구성)
        . 서버내 기족 현황 
        . 저장 제한
        . EOS 장비 교체 및 리빌딩
        . EDR 설치
        . 보안 진단 및 Solution 적용
      . 주요 과제 (Excel의 진행 현황의 완료율을 MockData로 구성)
        . 총 23개 과제 항목.
        . 항목별 내용은 첨부 참조.(보안 주요 과제)
  . PC 보안
    . 구분은 SKT, SKO, BP로 구분
    . OA망과 폐쇄망(60,192, 200)으로 구분
    . 각 항목별 수량은 첨부의 그림과 같음.      
    . 점검항목은 첨부 Excel 참조 (PC보안 점검항목)
    . MockData는 점검항목별 구성항목에 대한 양호/조치필요 대수.

securityMockData를 사용하여 보안 페이지를 구성할꺼야.
  - 보안 페이지는 다음과 같이 구성되어야 해.
    --------------------------------
    | KPI Card                      |
    --------------------------------
    |  서버보안         |   PC보안     |
    --------------------------------
  - KPI 카드는 아래와 같이 구현해줘.
    . 보안 현황 요약
      . 5가지 서버보안 항목에 대한 도넛 그래프.
      . 도넛 그래프 중앙에는 대상 서버 갯수 표현
      . 하위에 전월대비 증감% 표현.
  - 서버 보안 항목은 아래와 같이 구성해줘.    
    - 보안 주요 과제 현황
      . 진행중이거나 미완료된 항목만 표현.
      . Table 형태로 구현
  - PC 보안은 아래 내용을 표현해줘.
    - 월별 보안 점검 현황
      . SKT/ SKO / BP로 구분하여 표현
      . 점검 항목별 조치 현황 도넛 차트로 표현
      . 도넛 그래프 중앙에는 대상 대수 표현

Stable MockData를 만들려고 해. 아래와 같이 구성해줘.
  - 중부/서부 데이터 분리하여 운용 
  - 두개의 Contents로 운용. RM 현황 및 VoC 현황으로 분류
  - RM
    - 내용은 분류, 내용, 일시, 현황(처리 현황 - 처리 일시, 진행 내역, 완료일시 등)
    - 분류 및 내용은 첨부 이미지 참조
    - 처리현황 및 분류에 대한 정리가 가능하도록 본부별로 20개 정도 만들어줘.
  - VoC 현황
    - 내용은 아래와 같이 구성
      . 세부 상담명 분류 - HDVoice품질, WiFi문의, WiFi품질, 단말설정, 데이터품질, 부가서비스,영상품질, 음성품질, 제도/프로세스, 기타
      . 품질발생지역 코드 - 공공기관, 공사현장, 공장, 교육기관, 군부대, 기숙사, 도로, 리조트, 병원, 사무실, 상가, 선박, 신규아파트, 신축건물, 아파트, 오피스텔, 원룸/고시원, 주택, 철도, 팬션, 해상, 호텔, 휴양지, 미분류
      . 지역 구분 (광역시)
      . 지역 구분 (시/군/구)
      . 날짜
    - VoC 현황은 월간 차트 검색까지 가능하도록 본부당 1000건 이상씩 만들어줘. 만들경우에 상담명 및 품질발생지역이 골고루 들어갈 수 있도록 MockData 구분해서 만들어줘. 

안정 페이지를 구성하려고 해.

    --------------------------------
    | KPI Card                      |
    --------------------------------
    |  RM 현황         |    VoC 현황  |
    --------------------------------
  - KPI 카드는 두개로 구성하려고 해.
    . RM 현황 - 발생한 RM 중 진행중인 항목, 
    . VoC 현황 - 일간 총 VoC 현황
  - RM 현황은 Table 형태로 구성하고, 아래의 내용을 넣어줘.
    . 분류, 내용, 일시, 현황(처리/진행중)
  - VoC 현황을 일별 막대 차트로 만들어줘.
    . x축은 일자, y축은 VoC 건수
    . 필터 설계 
      . 세부 상담명
      . 품질발생지역 코드
      . 지역 구분(광역시 기준)  
      . 주간 / 월간
  - 데이터는 stabilityMockData 활용

보안 페이지 수정해줘.
  - KPI Card는 아래의 4가지 항목으로 구성.
    . 평문정보 저장제한. - 기존 저장 제한 데이터 사용
    . EOS 장비 교체 및 리빌딩
    . EDR 설치
    . SolidStep 설치 - 기존 보안 진단 및 Solution 적용 DB 사용
  - PC 보안 섹션 삭제
  - 서버 보안 섹션 PC 보안 섹션으로 이동
  - 서버 보안 섹션에 장비 현황 내용 추가.
    . 총 운용 장비 대수
    . 운용 장비 대수
    . 유휴 장비 대수
    . 구축 장비 대수
    . 폐기 장비 대수
    . 장비는 KPI의 서버 대수를 의미.
    . 5가지 항목에 대한 카드 섹션으로 표현하고, 전월 대비 증감(대수)로 표현해줘.
    . 카드섹션내용이 허전하지 않도록 적절한 Icon도 같이 삽입해줘.

보안 페이지의 전체 내용을 다음과 같이 수정해줘.
    --------------------------------
    | KPI Card                      |
    --------------------------------    
    | 장비 현황                      |
    --------------------------------
    | 주요 보안 과제 현황               |
    --------------------------------
    - 장비 현황은 5개의 항목을 수평으로 배치, Icon과 내용을 적절하게 구성.
    - 서버 보안 제목을 주요 보안 과제 현황으로 변경.
    - 과제 현황 내용이 10개 이상 될 경우 제목열을 고정하는 형태로 구성.
    - 제목열에 필터 구성하고(기한 제외), 기한 항목의 경우 오름차순/내림차순 정렬이 가능하도록 구성
      (기지국 세부 현황 Table의 형태 참조)

Home에서 구성된 품질 지표에서 중부 본부 구성에 도서지역을 포함해줘.
  - 품질 등급 요약에 현재 전체/대전/세종/충남/충북/KTX로 구성되어 있는 항목에 도서 지역 추가
  - CQ 품질 변화 추이에도 도서지역 추가
  - 관련된 MockData도 추가 생성

home의 주요 지표 카드 중 안정 부분에 안정 페이지 내용 연결해줘.
  - 작성 필요 내용은 진행중인 항목중 최신 순으로 3가지 항목만을 넣어줘.
  - 현재 구성된 주의, 정상, 위험 Badge은 삭제해줘.

자재 관리 MockData를 구성할꺼야.
  - 중부/서부 데이터 분리하여 운용 
  - 주요 내용은 첨부의 Excel 참조.
  - Excel의 항목중 아래 내용을 기준으로 MockData 구성
    . 입고번호,
    . 사업연도
    . 지역구분(중부/서부)
    . 업체명
    . 자재코드
    . 자재명
    . 자재 구분
    . 자재 상태
    . 수량
    . 입고일
    . 입고 구분
  - 엑셀 전체를 MockData로 구성하지 말고, 본부별로 200개 정도만 MockData로 만들어줘.


inventoryMockData를 사용해서 다음과 같이 자재현황 페이지를 구성할꺼야.
  - 아래와 같이 구성하려고 해.
    ------------------------------------------
    | KPI Card                                |
    ------------------------------------------
    | 신품/구품 비율       |    항목별 재고 현황     |
    ------------------------------------------
    ------------------------------------------
    | 입고 데이터 분석     | 업체별 재고 현황        |
    ------------------------------------------

  - KPI 카드는 아래와 같이 구성해줘. 구성시 전월 대비 증/감 표현도 같이 해줘.(필요시 MockData 생성)
    . 전체 자재 항목 (건)
    . 신품 수량 (개)
    . 구품 수량 (개)
    . 총재고 (개)
    . 재고 보유 항목(건)
    
  - 신품/구품 비율을 파이차트로 구성해줘.
  - 항목별 재고 현황을 파이차트로 구성해줘.
    . 광모듈/SFP
    . 안테나
    . 분배기/결합기
    . 전원/케이블
    . 중계기/증폭기
    . 인프라/외함
    . 커넥터/브라겟
  - 입고 데이터 분석은 파이차트로 구성해줘.
  - 업체별 재고 현황은 막대차트로 구성해주고 신품/구품 비율을 막대에 표현해줘.

자재 현황 페이지를 다음과 같이 수정해줘.
  - KPI를 제외하고 4개의 차트를 동일한 크기의 카드 섹션에 넣어줘.
  - PI차트는 도넛 차트로 변경하고 가운데는 총 수량을 넣어줘.
  - PI 차트 구성시 색을 원색 계열은 배제하고 구성해줘.
  - Pi 차트에서 숫자 항목은 없애줘.
  - 막대 차트에서 막대 그래프의 

파이차트를 아래와 같이 수정해줘.
  - Legend를 하단에 표시하지 말고 Pi차트에 연결선으로 표현해줘.

OpEx MockData를 구성할꺼야.
  - 중부/서부 데이터 분리하여 운용 
  - 세부 내용은 첨부 참조(첨부는 서부 기준)
  - 중부 내용도 서부와 유사한 형태로 구성 필요  

1st menU 항목에 아래의 기능 추가해줘.
  . "Network 도구" 버튼 추가.
  . 버튼을 누르면 DropDown 선택 항목 추가.
  . 선택 항목은 아래와 같이 구성.
    . NSR
    . LM 대시보드
    


OpEx Page 구성을 아래와 같이 수행하려고 해.
    ------------------------------------------
    | KPI Card                                |
    ------------------------------------------    
    | 주요 차트 구성 1                            |
    ------------------------------------------
    | 주요 차트 구성 2                            |
    ------------------------------------------

    - KPI는 아래 항목으로 구성해줘.
      . OpEx 집행율
      . 매출 집행률
      . EBITDA 달성율
      . 비용 대비 매출 비율
    - 주요 차트 구성은 아래의 차트 구성을 진행해줘.
      . 월별 누적 집행율 (필요시 MockData 추가)
        . 
      . 세부 항목별 누적 집행율


CapEx 구성 내용을 아래와 같이 수정하려고 해.
  - 순서는 AFE 차수별 누적 승인/집행 추이 / 공사 단계별 현황/AFE 차수별 진행률 로 구분해줘.
  - AFE 차수는 4개 차수가 기본이고 추후 확장될 수 있는 개념으로 구성해줘.
    . 현재는 AFE 1차이고, 5월에 2차 승인 예정이야. (현재는 1차만 승인되었음)
    . AFE 차수별 누적 승인/집행추이 차트에서 승인이 되었을 경우는 실선, 미승인된 금액은 점선으로 표현해줘.
  - 공사 단계별 현황 --> 투자 Process 별 진행 현황으로 제목 변경
    . 사업 목표 차트 옆의 화살표는 지워주고, 사업목표 중앙에는 목표 건수를 표현해줘.
    . NSheet 발행, 선로 개통, 장비설치, 시험개통 의 경우 도넛 차트 중앙에 %만 나오게 구성해줘.
  
  
  도넛 차트에서 건, %등을 삭제해고 단위는 제목 옆()안에 표현해줘. 그리고 도넛 차트 안의 숫자 크기는 현재 대비 70%로 해줘.

  월별 집행(막대)는 지워줘. 
  KPI 카드의 공사 집행금액(실적), 예산 소진율, 공사 완료율을 표현할때 당월실적도 함께 표현해줘. 
  투자 Process별 진행 현황에서도 항목별(사업목표 제외)당월 실적을 함께 표현해줘.

  도넛 그래프에서 마우스 호버링시 항목수(갯수)가 나타나도록 구성하고 도넛 하위에 있는 Bar chart는 삭제해줘.
  Bar차트에 있는 당월 실적은 도넛 차트 하위의 텍스트 옆에 나오도록 구성해줘.
  도넛 차트의 제목(상단) 및 하단(미발행 및 대기 건수)사이의 공백을 줄여줘(현재의 반으로 줄여줘.)

  Home의 주요 지표 항목의 CapEx와 연계해줘.
    - home에서 표현되는 주요 지표와 CapEx 페이지의 KPI 항목을 일치시켜 표현해줘.

  

  Home의 시안성을 높이려고 해. 우선 글자 크기의 기준을 아래와 같이 잡을께,
    * Quality Panel의 내용중 품질 등급 요약 옆에 설계된 필더를 배치해줘.
    * 전일, 금일 집계 기준에 대한 내용은 하위 Title은 * 전일(기준), * 금일(기준) 옆에 넣어줘. 하위 Title의 크기는 Title : text-sm, 기준은 title-xs로 구성해줘.


homeㅡ이 본부 시군구별 품질 현황 지도 카드를 아래와 같이 변경해줘.
  - 배치를 다음과 같이 구성해줘.
  -------------------------------------
  |Map         |Worst 5       | Legend|
  -------------------------------------


Home의 CQ 품질 변화 추이를 아래와 같이 수정해줘.
  - Title인 CQ 품질 변화 추이의 글씨는 text-base로 구성하고, "Reference 전국현황"은 삭제해줘.
  - 필터는 Title 옆에 배치해줘.
  - Sub Title인 일별, 시간별은 gray-600으로 구성하고, text-sm으로 구성해줘.
  - 그래프의 Title은 text-[11px]로 해주고, 그래프의 x축, y축, Legend의 크기는 text-[11px]로 구성해줘.

주요 지표 항목의 Card Section을 아래와 같이 수정할꺼야.
  - 각 카드별 Title의 크기는 text-sm으로 해줘.

주요 지표 5개의 카드중 안정 항목에 대해 아래와 같이 수정해줘.
  - title 옆의 설명의 글씨 크기를 text-sm, gray-600으로 변경
  - 각 데이터 항목의 글씨 크기는 text-sm, 일시 및 장소는 우측 정렬로 항목 옆에 배치(text-10)

주요 지표 5개의 카드 중 안전/보안을 아래와 같이 구성해줘.
  - 안전/보안을 두개의 카드로 분리해줘.
  - 분리된 카드는 지표 카드의 스타일과 맞도록 구성해줘.(title 크기 text-sm)

주요 지표 5개의 카드 중 Opex 집행 항목을 Opex Page의 KPI 카드 항목과 맞추어 변경해줘.

안전 카드를 아래와 같이 수정해줘.
 - 안전 -> 작업안전으로 변경
 - 우측 "work safety" 대신 당일/주간으로 변경
 - 고위험 작업, 야간 작업, 원거리 작업, 사옥 작업의 Text 크기를 text-xs로 변경.
 - 데이터는 text-sm으로 데이터만 표시 
 - 데이터 상단의 당일/주간 삭제

보안 카드는 아래와 같이 구성해줘.
 - 카드 위치를 OpEx 집행 하단으로 옮겨줘.
 - 보안 Title 크기는 Text-[15px]로 변경해줘.
 - Title 옆에 Text-sm, gray-500으로 총 서버 대수를 나타내줘.
 - 각 데이터는 도넛 차트로 구성하고, Legend는 표현하지 말아줘.
 - 도넛 차트 가운데에 % 표시하고, 도넛 차트에 호버링시 대수가 표현되게 구성해줘.
 - 차트의 제목은 차트 아래에 넣어줘.

Capex와 Opex 항목을 아래와 같이 정리해줘.
 - 4개의 항목을 1줄로 표현.
 - 항목의 뱃지는 표현하지 않음.
 - Sub-Title들의 크기는 text-[13px], 데이터 크기는 text-base로 구성.


보안 페이지를 수정하려고 해.
  - "보안 현황 요약", "장비 현황", "주요 보안 과제 현황"의 섹션별 Title은 text-[15px]로 구성
  - 보안 현황 요약의 도넛 차트를 구성하는 박스의 세로 크기를 현재보다 20% 증가.


자재 현황을 아래와 같이 수정하려고 해.
 - 월별 자재 현황 그래프를 표출.
   . 위치는 KPI 하위 항목에 배치.
   . 월별 자재 소모량을 확인하려는 목표로 구성할꺼야.
   . 표출하려는 내용은 월별 자재 수량에 대한 그래프로 표현할꺼야.
   . 자재 보유 수량에 대한 목표가 있고, 현재 수량을 현재와 비교하는 형태로 구성.   
 - 현재 나와있는 도넛 차트를 한줄로 표현.


Home의 배치를 아래와 같이 변경하려고 해.
 - 현재
   --------------------------------------
   |  중부 본부 시군구별 품질 현황              |
   ---------------------------------------
   |CQ 품질 변황 추이                        |
   |-------------------  -----------------|
   | 일별 추이           | |시간별 추이        |
   |-------------------  -----------------|
   ----------------------------------------

 - 변경
   -------------------  -------------------
   | 시군구별 품질현황    | | CQ 품질 변화 추이    |
   -------------------  ------------------- 

   * 시군구별 품질 현황은 아래와 같이 구성해줘.
     -----------------------
     | worst 5지역           |
     -----------------------
     |  Map                 |
     -----------------------
     

   * CQ 품질 변화 추이는 아래와 같이 구성해줘.
     ---------------------
     | 일별 추이            |
     ---------------------
     | 시간별 추이           |
     ---------------------

CQ 품질변화 추이 그래프를 아래와 같이 수정해줘.
  - 일별 차트와 시간별 차트를 Tab으로 선택할 수 있게 구성해줘.
  - Tab 별 그래프틑 1등급, 4등급 이하 그래프로 구성해주고, 그래프는 구성되는 카드 섹션에 맞도록 구성해줘.