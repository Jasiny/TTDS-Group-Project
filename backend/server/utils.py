from datetime import datetime


def get_res_time(time):
    # dividing 1000 is because js time returns the timestamp in milliseconds
    sent_time = datetime.fromtimestamp(int(time) / 1000.0)
    rcvd_time = datetime.now()
    return (rcvd_time-sent_time).total_seconds()
